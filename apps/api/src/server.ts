import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "./db";
import { firebaseAuth } from "./firebase";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
function getUserId(req: any): string {
  return req.user?.sub as string;
}

async function getOptionalUserId(req: any): Promise<string | null> {
  if (!req.headers?.authorization) return null;
  try {
    await req.jwtVerify();
    return req.user?.sub as string;
  } catch {
    return null;
  }
}

function addRole(roles: UserRole[], role: UserRole): UserRole[] {
  return roles.includes(role) ? roles : [...roles, role];
}

function removeRole(roles: UserRole[], role: UserRole): UserRole[] {
  return roles.filter((existing) => existing !== role);
}

const listQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  take: z.coerce.number().int().min(1).max(100).optional(),
  skip: z.coerce.number().int().min(0).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
const firebaseLoginSchema = z.object({
  idToken: z.string().min(1),
  email: z.string().email().optional(),
});
const updateMeSchema = z.object({
  email: z.string().email().optional(),
});
const createArtistProfileSchema = z.object({
  displayName: z.string().min(1),
  tagline: z.string().optional(),
  bio: z.string().optional(),
  hometown: z.string().optional(),
  genres: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  memberCount: z.number().int().optional(),
  rating: z.number().optional(),
  totalShows: z.number().int().optional(),
  typicalDraw: z.string().optional(),
  availableForHire: z.boolean().optional(),
  needsSleep: z.boolean().optional(),
  upcomingTourDates: z.array(z.object({ city: z.string(), date: z.string() })).optional(),
  responseTime: z.string().optional(),
  spotifyArtistId: z.string().optional(),
  instagramUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  bandcampUrl: z.string().optional(),
  appleMusicUrl: z.string().optional(),
});
const createHostProfileSchema = z.object({
  displayName: z.string().min(1),
  bio: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  capacity: z.number().int().optional(),
  venueType: z.string().optional(),
  artistSleep: z.boolean().optional(),
  topGenres: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  availability: z.string().optional(),
  responseTime: z.string().optional(),
  rating: z.number().optional(),
  totalShows: z.number().int().optional(),
  sleepDetails: z.string().optional(),
});
const createConversationSchema = z.object({
  hostUserId: z.string().optional(),
  artistUserId: z.string().optional(),
});
const createMessageSchema = z.object({
  body: z.string().min(1).max(2000),
});
const optionalInt = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    return Number.isNaN(num) ? val : num;
  },
  z.number().int().optional()
);
const proposalUpsertSchema = z.object({
  title: z.string().optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  description: z.string().optional(),
  expectedAttendance: optionalInt,
  setLengthMinutes: optionalInt,
  loadInMinutes: optionalInt,
  technicalRequirements: z.string().optional(),
  additionalNotes: z.string().optional(),
  visibility: z.enum(["PUBLIC", "LINK_ONLY"]).optional(),
  ticketingEnabled: z.boolean().optional(),
  ticketPriceCents: optionalInt,
});
const addressUpdateSchema = z.object({
  address: z.string().min(3),
});
const ticketPurchaseSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(10).optional(),
});

async function getConversationForUser(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
        proposal: true,
        hostUser: { select: { id: true, hostProfile: true } },
        artistUser: { select: { id: true, artistProfile: true } },
      },
  });
  if (!conversation) return null;
  if (conversation.hostUserId !== userId && conversation.artistUserId !== userId) return "forbidden";
  return conversation;
}

async function main() {
  const app = Fastify({ logger: true });

  const allowedOrigins = new Set(
    [
      process.env.FRONTEND_ORIGIN,
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter(Boolean)
  );

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.has(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  });

  app.get("/health", async () => ({ ok: true }));

  app.post("/auth/signup", async (req, reply) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return reply.code(409).send({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash, roles: ["FAN"] },
      select: { id: true, email: true, roles: true, createdAt: true },
    });

    const token = await reply.jwtSign({ sub: user.id });
    return reply.send({ user, token });
  });

  app.post("/auth/login", async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) return reply.code(401).send({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ error: "Invalid credentials" });

    const token = await reply.jwtSign({ sub: user.id });

    return reply.send({
      user: { id: user.id, email: user.email, roles: user.roles, createdAt: user.createdAt },
      token,
    });
  });

  app.post("/auth/firebase", async (req, reply) => {
    const parsed = firebaseLoginSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const { idToken, email } = parsed.data;
    let decoded;
    try {
      decoded = await firebaseAuth.verifyIdToken(idToken);
    } catch {
      return reply.code(401).send({ error: "Invalid Firebase token" });
    }

    const phoneNumber = decoded.phone_number;
    const firebaseUid = decoded.uid;
    if (!phoneNumber) {
      return reply.code(400).send({ error: "Phone number missing on Firebase user" });
    }

    let user =
      (await prisma.user.findUnique({ where: { firebaseUid } })) ??
      (await prisma.user.findUnique({ where: { phoneNumber } }));

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email ?? null,
          phoneNumber,
          firebaseUid,
          roles: ["FAN"],
        },
      });
    } else if (email && !user.email) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { email },
      });
    }

    const token = await reply.jwtSign({ sub: user.id });
    return reply.send({
      user: { id: user.id, email: user.email, roles: user.roles, createdAt: user.createdAt },
      token,
    });
  });

  // Authentication decorator
  (app as any).decorate("authenticate", async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ error: "Unauthorized" });
    }
  });

  app.get("/me", { preHandler: (app as any).authenticate }, async (req: any) => {
    const userId = req.user.sub as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, roles: true, createdAt: true },
    });

    return { user };
  });

  app.patch("/me", { preHandler: (app as any).authenticate }, async (req: any, reply: any) => {
    const parsed = updateMeSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const userId = req.user.sub as string;
    const { email } = parsed.data;
    if (!email) return reply.code(400).send({ error: "No fields to update" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== userId) {
      return reply.code(409).send({ error: "Email already in use" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { email },
      select: { id: true, email: true, roles: true, createdAt: true },
    });

    return { user };
  });

  // Artist profile endpoints
  app.post(
    "/artist",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const parsed = createArtistProfileSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const userId = getUserId(req);

      const existing = await prisma.artistProfile.findUnique({ where: { userId } });
      if (existing) return reply.code(409).send({ error: "Artist profile already exists" });

      const data = parsed.data;

      const profile = await prisma.artistProfile.create({
        data: {
          userId,
          displayName: data.displayName,
          tagline: data.tagline,
          bio: data.bio,
          hometown: data.hometown,
          genres: data.genres ?? [],
          imageUrl: data.imageUrl,
          images: data.images ?? [],
          memberCount: data.memberCount,
          rating: data.rating,
          totalShows: data.totalShows,
          typicalDraw: data.typicalDraw,
          availableForHire: data.availableForHire ?? false,
          needsSleep: data.needsSleep ?? false,
          upcomingTourDates: data.upcomingTourDates,
          responseTime: data.responseTime,
          spotifyArtistId: data.spotifyArtistId,
          instagramUrl: data.instagramUrl,
          websiteUrl: data.websiteUrl,
          bandcampUrl: data.bandcampUrl,
          appleMusicUrl: data.appleMusicUrl,
        },
      });

      // ensure user has ARTIST role
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const roles = addRole(user.roles, "ARTIST");
        if (roles !== user.roles) {
          await prisma.user.update({ where: { id: userId }, data: { roles } });
        }
      }

      return reply.code(201).send({ profile });
    }
  );

  app.get("/artist/:id", async (req: any, reply: any) => {
    const { id } = req.params;
    const profile = await prisma.artistProfile.findUnique({ where: { id } });
    if (!profile) return reply.code(404).send({ error: "Not found" });
    return { profile };
  });

  app.get("/artist/me", { preHandler: (app as any).authenticate }, async (req: any, reply: any) => {
    const userId = getUserId(req);
    const profile = await prisma.artistProfile.findUnique({ where: { userId } });
    if (!profile) return reply.code(404).send({ error: "Not found" });
    return { profile };
  });

  app.get("/artists", async (req: any, reply: any) => {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const { q, take = 50, skip = 0 } = parsed.data;
    const queryMode: Prisma.QueryMode = "insensitive";
    const where = q
      ? {
          OR: [
            { displayName: { contains: q, mode: queryMode } },
            { bio: { contains: q, mode: queryMode } },
            { hometown: { contains: q, mode: queryMode } },
            { spotifyArtistId: { contains: q, mode: queryMode } },
            { genres: { has: q } },
          ],
        }
      : undefined;

    const artists = await prisma.artistProfile.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
    });
    return { artists, count: artists.length };
  });

  app.patch(
    "/artist",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const userId = getUserId(req);
      const parsed = createArtistProfileSchema.partial().safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const existing = await prisma.artistProfile.findUnique({ where: { userId } });
      if (!existing) return reply.code(404).send({ error: "Artist profile not found" });

      const updated = await prisma.artistProfile.update({ where: { userId }, data: parsed.data as any });
      return { profile: updated };
    }
  );

  app.delete(
    "/artist",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const userId = getUserId(req);
      const existing = await prisma.artistProfile.findUnique({ where: { userId } });
      if (!existing) return reply.code(404).send({ error: "Artist profile not found" });

      await prisma.artistProfile.delete({ where: { userId } });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const roles = removeRole(user.roles, "ARTIST");
        if (roles !== user.roles) {
          await prisma.user.update({ where: { id: userId }, data: { roles } });
        }
      }

      return reply.code(204).send();
    }
  );

  // Host profile endpoints
  app.post(
    "/host",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const parsed = createHostProfileSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const userId = getUserId(req);
      const existing = await prisma.hostProfile.findUnique({ where: { userId } });
      if (existing) return reply.code(409).send({ error: "Host profile already exists" });

      const profile = await prisma.hostProfile.create({
        data: {
          userId,
          ...parsed.data,
          topGenres: parsed.data.topGenres ?? [],
          images: parsed.data.images ?? [],
          amenities: parsed.data.amenities ?? [],
          artistSleep: parsed.data.artistSleep ?? false,
        },
      });

      // ensure user has HOST role
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const roles = addRole(user.roles, "HOST");
        if (roles !== user.roles) {
          await prisma.user.update({ where: { id: userId }, data: { roles } });
        }
      }

      return reply.code(201).send({ profile });
    }
  );

  app.get("/host/:id", async (req: any, reply: any) => {
    const { id } = req.params;
    const profile = await prisma.hostProfile.findUnique({ where: { id } });
    if (!profile) return reply.code(404).send({ error: "Not found" });
    return { profile };
  });

  app.get("/host/me", { preHandler: (app as any).authenticate }, async (req: any, reply: any) => {
    const userId = getUserId(req);
    const profile = await prisma.hostProfile.findUnique({ where: { userId } });
    if (!profile) return reply.code(404).send({ error: "Not found" });
    return { profile };
  });

  app.patch(
    "/host",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const userId = getUserId(req);
      const parsed = createHostProfileSchema.partial().safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const existing = await prisma.hostProfile.findUnique({ where: { userId } });
      if (!existing) return reply.code(404).send({ error: "Host profile not found" });

      const updated = await prisma.hostProfile.update({ where: { userId }, data: parsed.data as any });
      return { profile: updated };
    }
  );

  app.delete(
    "/host",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const userId = getUserId(req);
      const existing = await prisma.hostProfile.findUnique({ where: { userId } });
      if (!existing) return reply.code(404).send({ error: "Host profile not found" });

      await prisma.hostProfile.delete({ where: { userId } });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const roles = removeRole(user.roles, "HOST");
        if (roles !== user.roles) {
          await prisma.user.update({ where: { id: userId }, data: { roles } });
        }
      }

      return reply.code(204).send();
    }
  );

  app.get("/hosts", async (req: any, reply: any) => {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

    const { q, take = 50, skip = 0 } = parsed.data;
    const queryMode: Prisma.QueryMode = "insensitive";
    const where = q
      ? {
          OR: [
            { displayName: { contains: q, mode: queryMode } },
            { bio: { contains: q, mode: queryMode } },
            { city: { contains: q, mode: queryMode } },
            { neighborhood: { contains: q, mode: queryMode } },
          ],
        }
      : undefined;

    const hosts = await prisma.hostProfile.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
    });
    return { hosts, count: hosts.length };
  });

  // Conversation + messaging + proposals
  app.post(
    "/conversations",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const parsed = createConversationSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const userId = getUserId(req);
      let { hostUserId, artistUserId } = parsed.data;

      if (!hostUserId && !artistUserId) {
        return reply.code(400).send({ error: "Provide a hostUserId or artistUserId" });
      }

      if (!hostUserId) hostUserId = userId;
      if (!artistUserId) artistUserId = userId;

      if (hostUserId === artistUserId) {
        return reply.code(400).send({ error: "Host and artist must be different users" });
      }

      if (userId !== hostUserId && userId !== artistUserId) {
        return reply.code(403).send({ error: "You must be a participant" });
      }

      const conversation = await prisma.conversation.upsert({
        where: { hostUserId_artistUserId: { hostUserId, artistUserId } },
        create: { hostUserId, artistUserId },
        update: {},
        include: {
        proposal: true,
        hostUser: { select: { id: true, hostProfile: true } },
        artistUser: { select: { id: true, artistProfile: true } },
      },
      });

      return reply.send({ conversation });
    }
  );

  app.get(
    "/conversations",
    { preHandler: (app as any).authenticate },
    async (req: any) => {
      const userId = getUserId(req);
      const conversations = await prisma.conversation.findMany({
        where: {
          OR: [{ hostUserId: userId }, { artistUserId: userId }],
        },
        orderBy: { createdAt: "desc" },
        include: {
        proposal: true,
        hostUser: { select: { id: true, hostProfile: true } },
        artistUser: { select: { id: true, artistProfile: true } },
      },
      });
      return { conversations };
    }
  );

  app.get(
    "/conversations/:id",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const { id } = req.params as { id: string };
      const userId = getUserId(req);
      const conversation = await getConversationForUser(id, userId);
      if (conversation === "forbidden") return reply.code(403).send({ error: "Forbidden" });
      if (!conversation) return reply.code(404).send({ error: "Not found" });
      return { conversation };
    }
  );

  app.get(
    "/conversations/:id/messages",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const { id } = req.params;
      const userId = getUserId(req);
      const conversation = await getConversationForUser(id, userId);
      if (conversation === "forbidden") return reply.code(403).send({ error: "Forbidden" });
      if (!conversation) return reply.code(404).send({ error: "Not found" });

      const messages = await prisma.message.findMany({
        where: { conversationId: id },
        orderBy: { createdAt: "asc" },
      });
      return { messages };
    }
  );

  app.post(
    "/conversations/:id/messages",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const parsed = createMessageSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const { id } = req.params;
      const userId = getUserId(req);
      const conversation = await getConversationForUser(id, userId);
      if (conversation === "forbidden") return reply.code(403).send({ error: "Forbidden" });
      if (!conversation) return reply.code(404).send({ error: "Not found" });

      const message = await prisma.message.create({
        data: {
          conversationId: id,
          senderUserId: userId,
          body: parsed.data.body,
        },
      });
      return reply.code(201).send({ message });
    }
  );

  app.put(
    "/conversations/:id/proposal",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const parsed = proposalUpsertSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const { id } = req.params;
      const userId = getUserId(req);
      const conversation = await getConversationForUser(id, userId);
      if (conversation === "forbidden") return reply.code(403).send({ error: "Forbidden" });
      if (!conversation) return reply.code(404).send({ error: "Not found" });
      if (conversation.proposal?.status === "CONFIRMED") {
        return reply.code(409).send({ error: "Proposal already confirmed" });
      }

      let parsedDate: Date | undefined;
      if (parsed.data.date) {
        const date = new Date(parsed.data.date);
        if (Number.isNaN(date.getTime())) {
          return reply.code(400).send({ error: "Invalid date" });
        }
        parsedDate = date;
      }

      const createData: Prisma.ProposalCreateInput = {
        conversation: { connect: { id } },
        status: "DRAFT",
        visibility: parsed.data.visibility ?? "PUBLIC",
        ticketingEnabled: parsed.data.ticketingEnabled ?? false,
      };

      if (parsed.data.title !== undefined) createData.title = parsed.data.title;
      if (parsedDate !== undefined) createData.date = parsedDate;
      if (parsed.data.startTime !== undefined) createData.startTime = parsed.data.startTime;
      if (parsed.data.description !== undefined) createData.description = parsed.data.description;
      if (parsed.data.expectedAttendance !== undefined)
        createData.expectedAttendance = parsed.data.expectedAttendance;
      if (parsed.data.setLengthMinutes !== undefined)
        createData.setLengthMinutes = parsed.data.setLengthMinutes;
      if (parsed.data.loadInMinutes !== undefined) createData.loadInMinutes = parsed.data.loadInMinutes;
      if (parsed.data.technicalRequirements !== undefined)
        createData.technicalRequirements = parsed.data.technicalRequirements;
      if (parsed.data.additionalNotes !== undefined)
        createData.additionalNotes = parsed.data.additionalNotes;
      if (parsed.data.ticketPriceCents !== undefined)
        createData.ticketPriceCents = parsed.data.ticketPriceCents;

      const updateData: Prisma.ProposalUpdateInput = {};
      if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
      if (parsedDate !== undefined) updateData.date = parsedDate;
      if (parsed.data.startTime !== undefined) updateData.startTime = parsed.data.startTime;
      if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
      if (parsed.data.expectedAttendance !== undefined)
        updateData.expectedAttendance = parsed.data.expectedAttendance;
      if (parsed.data.setLengthMinutes !== undefined)
        updateData.setLengthMinutes = parsed.data.setLengthMinutes;
      if (parsed.data.loadInMinutes !== undefined) updateData.loadInMinutes = parsed.data.loadInMinutes;
      if (parsed.data.technicalRequirements !== undefined)
        updateData.technicalRequirements = parsed.data.technicalRequirements;
      if (parsed.data.additionalNotes !== undefined)
        updateData.additionalNotes = parsed.data.additionalNotes;
      if (parsed.data.visibility !== undefined) updateData.visibility = parsed.data.visibility;
      if (parsed.data.ticketingEnabled !== undefined)
        updateData.ticketingEnabled = parsed.data.ticketingEnabled;
      if (parsed.data.ticketPriceCents !== undefined)
        updateData.ticketPriceCents = parsed.data.ticketPriceCents;

      const proposal = await prisma.proposal.upsert({
        where: { conversationId: id },
        create: createData,
        update: updateData,
      });

      return { proposal };
    }
  );

  app.post(
    "/conversations/:id/proposal/send",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const { id } = req.params;
      const userId = getUserId(req);
      const conversation = await getConversationForUser(id, userId);
      if (conversation === "forbidden") return reply.code(403).send({ error: "Forbidden" });
      if (!conversation) return reply.code(404).send({ error: "Not found" });
      if (!conversation.proposal) return reply.code(404).send({ error: "Proposal not found" });
      if (conversation.proposal.status === "CONFIRMED") {
        return reply.code(409).send({ error: "Proposal already confirmed" });
      }

      const proposal = await prisma.proposal.update({
        where: { conversationId: id },
        data: { status: "SENT" },
      });

      return { proposal };
    }
  );

  app.post(
    "/conversations/:id/proposal/reject",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const { id } = req.params;
      const userId = getUserId(req);
      const conversation = await getConversationForUser(id, userId);
      if (conversation === "forbidden") return reply.code(403).send({ error: "Forbidden" });
      if (!conversation) return reply.code(404).send({ error: "Not found" });
      if (!conversation.proposal) return reply.code(404).send({ error: "Proposal not found" });
      if (conversation.proposal.status === "CONFIRMED") {
        return reply.code(409).send({ error: "Proposal already confirmed" });
      }

      const proposal = await prisma.proposal.update({
        where: { conversationId: id },
        data: { status: "DRAFT" },
      });

      return { proposal };
    }
  );

  app.post(
    "/conversations/:id/proposal/confirm",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const { id } = req.params;
      const userId = getUserId(req);
      const conversation = await getConversationForUser(id, userId);
      if (conversation === "forbidden") return reply.code(403).send({ error: "Forbidden" });
      if (!conversation) return reply.code(404).send({ error: "Not found" });
      if (!conversation.proposal) return reply.code(404).send({ error: "Proposal not found" });
      if (conversation.proposal.status === "CONFIRMED") {
        return reply.code(409).send({ error: "Proposal already confirmed" });
      }

      const [hostProfile, artistProfile] = await Promise.all([
        prisma.hostProfile.findUnique({ where: { userId: conversation.hostUserId } }),
        prisma.artistProfile.findUnique({ where: { userId: conversation.artistUserId } }),
      ]);

      const result = await prisma.$transaction(async (tx) => {
        const proposal = await tx.proposal.update({
          where: { conversationId: id },
          data: { status: "CONFIRMED" },
        });

        const event = await tx.event.create({
          data: {
            proposalId: proposal.id,
            hostProfileId: hostProfile?.id ?? null,
            artistProfileId: artistProfile?.id ?? null,
            publishedAt: new Date(),
            visibility: proposal.visibility,
            ticketingEnabled: proposal.ticketingEnabled,
            ticketPriceCents: proposal.ticketPriceCents,
            capacity: proposal.expectedAttendance,
            address: null,
          },
        });

        return { proposal, event };
      });

      return result;
    }
  );

  // Events
  app.get("/events", async (req: any) => {
    const userId = await getOptionalUserId(req);
    const events = await prisma.event.findMany({
      orderBy: { publishedAt: "desc" },
      include: {
        proposal: true,
        hostProfile: true,
        artistProfile: true,
        tickets: { select: { quantity: true, userId: true } },
      },
    });
    const enriched = events.map(({ tickets, ...event }) => {
      const ticketsSold = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      const canViewAddress =
        userId &&
        (event.hostProfile?.userId === userId ||
          event.artistProfile?.userId === userId ||
          tickets.some((ticket) => ticket.userId === userId));
      return {
        ...event,
        address: canViewAddress ? event.address : null,
        ticketsSold,
      };
    });
    return { events: enriched };
  });

  app.get("/events/:id", async (req: any, reply: any) => {
    const { id } = req.params;
    const userId = await getOptionalUserId(req);
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        proposal: true,
        hostProfile: true,
        artistProfile: true,
        tickets: { select: { quantity: true, userId: true } },
      },
    });
    if (!event) return reply.code(404).send({ error: "Not found" });
    const ticketsSold = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const canViewAddress =
      userId &&
      (event.hostProfile?.userId === userId ||
        event.artistProfile?.userId === userId ||
        event.tickets.some((ticket) => ticket.userId === userId));
    const { tickets, ...payload } = event;
    return { event: { ...payload, address: canViewAddress ? event.address : null, ticketsSold } };
  });

  app.patch(
    "/events/:id/address",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const parsed = addressUpdateSchema.safeParse(req.body);
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const { id } = req.params;
      const userId = getUserId(req);
      const event = await prisma.event.findUnique({
        where: { id },
        include: { hostProfile: true },
      });
      if (!event) return reply.code(404).send({ error: "Event not found" });
      if (event.hostProfile?.userId !== userId) {
        return reply.code(403).send({ error: "Only the host can update the address" });
      }

      const updated = await prisma.event.update({
        where: { id },
        data: { address: parsed.data.address },
        include: {
          proposal: true,
          hostProfile: true,
          artistProfile: true,
          tickets: { select: { quantity: true } },
        },
      });

      const ticketsSold = updated.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      const { tickets, ...payload } = updated;
      return reply.send({ event: { ...payload, ticketsSold } });
    }
  );

  app.post(
    "/events/:id/tickets",
    { preHandler: (app as any).authenticate },
    async (req: any, reply: any) => {
      const parsed = ticketPurchaseSchema.safeParse(req.body ?? {});
      if (!parsed.success) return reply.code(400).send({ error: parsed.error.flatten() });

      const { id } = req.params;
      const userId = getUserId(req);
      const quantity = parsed.data.quantity ?? 1;

      const event = await prisma.event.findUnique({
        where: { id },
        include: { tickets: true },
      });
      if (!event) return reply.code(404).send({ error: "Event not found" });
      if (!event.ticketingEnabled) {
        return reply.code(400).send({ error: "Ticketing is not enabled for this event" });
      }

      const sold = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      const capacity = event.capacity ?? null;
      if (capacity !== null && sold + quantity > capacity) {
        return reply.code(409).send({ error: "Not enough tickets remaining" });
      }

      const ticket = await prisma.ticket.upsert({
        where: { eventId_userId: { eventId: id, userId } },
        create: { eventId: id, userId, quantity },
        update: { quantity: { increment: quantity } },
      });

      return reply.code(201).send({ ticket });
    }
  );

  const port = Number(process.env.PORT ?? 3001);
  await app.listen({ port, host: "0.0.0.0" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
