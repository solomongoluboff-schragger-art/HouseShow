const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

type QueryParams = Record<string, string | number | undefined>;

function buildQuery(params: QueryParams): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") return;
    search.set(key, String(value));
  });
  const suffix = search.toString();
  return suffix ? `?${suffix}` : "";
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let detail = "Request failed";
    try {
      const body = await res.json();
      detail = body?.error?.message ?? body?.error ?? detail;
    } catch {
      const text = await res.text();
      if (text) detail = text;
    }
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type ArtistProfile = {
  id: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  displayName: string;
  tagline?: string | null;
  bio?: string | null;
  hometown?: string | null;
  genres: string[];
  imageUrl?: string | null;
  images?: string[] | null;
  memberCount?: number | null;
  rating?: number | null;
  totalShows?: number | null;
  typicalDraw?: string | null;
  availableForHire?: boolean | null;
  needsSleep?: boolean | null;
  upcomingTourDates?: Array<{ city: string; date: string }> | null;
  responseTime?: string | null;
  spotifyArtistId?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  bandcampUrl?: string | null;
  appleMusicUrl?: string | null;
};

export type HostProfile = {
  id: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  displayName: string;
  bio?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  capacity?: number | null;
  venueType?: string | null;
  artistSleep?: boolean | null;
  sleepDetails?: string | null;
  topGenres?: string[] | null;
  images?: string[] | null;
  amenities?: string[] | null;
  availability?: string | null;
  responseTime?: string | null;
  rating?: number | null;
  totalShows?: number | null;
};

export type ProposalStatus = "DRAFT" | "SENT" | "CONFIRMED";
export type ProposalVisibility = "PUBLIC" | "LINK_ONLY";

export type Proposal = {
  id: string;
  conversationId: string;
  status: ProposalStatus;
  title?: string | null;
  date?: string | null;
  startTime?: string | null;
  description?: string | null;
  expectedAttendance?: number | null;
  setLengthMinutes?: number | null;
  loadInMinutes?: number | null;
  technicalRequirements?: string | null;
  additionalNotes?: string | null;
  visibility: ProposalVisibility;
  ticketingEnabled: boolean;
  ticketPriceCents?: number | null;
};

export type Conversation = {
  id: string;
  hostUserId: string;
  artistUserId: string;
  createdAt: string;
  proposal?: Proposal | null;
  hostUser?: { id: string; hostProfile?: HostProfile | null };
  artistUser?: { id: string; artistProfile?: ArtistProfile | null };
};

export type Message = {
  id: string;
  conversationId: string;
  senderUserId: string;
  body: string;
  createdAt: string;
};

export type Event = {
  id: string;
  proposalId: string;
  publishedAt: string;
  visibility: ProposalVisibility;
  ticketingEnabled: boolean;
  ticketPriceCents?: number | null;
  capacity?: number | null;
  address?: string | null;
  hostProfileId?: string | null;
  artistProfileId?: string | null;
  ticketsSold?: number;
};


export type AuthResponse = {
  user: { id: string; email: string; roles: string[]; createdAt: string };
  token: string;
};

export async function signup(email: string, password: string) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(token: string) {
  return apiRequest<{ user: { id: string; email: string; roles: string[]; createdAt: string } }>(
    "/me",
    {},
    token
  );
}

export async function listArtists(q?: string) {
  const query = buildQuery({ q, take: 100 });
  return apiRequest<{ artists: ArtistProfile[] }>(`/artists${query}`);
}

export async function listHosts(q?: string) {
  const query = buildQuery({ q, take: 100 });
  return apiRequest<{ hosts: HostProfile[] }>(`/hosts${query}`);
}


export type EventWithDetails = Event & {
  proposal?: Proposal | null;
  hostProfile?: HostProfile | null;
  artistProfile?: ArtistProfile | null;
};

export async function listEvents(token?: string) {
  return apiRequest<{ events: EventWithDetails[] }>("/events", {}, token);
}

export async function getEvent(id: string, token?: string) {
  return apiRequest<{ event: EventWithDetails }>(`/events/${id}`, {}, token);
}

export async function updateEventAddress(id: string, address: string, token: string) {
  return apiRequest<{ event: EventWithDetails }>(
    `/events/${id}/address`,
    {
      method: "PATCH",
      body: JSON.stringify({ address }),
    },
    token
  );
}

export async function purchaseTicket(
  id: string,
  payload: { quantity?: number },
  token: string
) {
  return apiRequest<{ ticket: { id: string; eventId: string; userId: string; quantity: number } }>(
    `/events/${id}/tickets`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function createConversation(
  payload: { hostUserId?: string; artistUserId?: string },
  token: string
) {
  return apiRequest<{ conversation: Conversation }>(
    "/conversations",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function listConversations(token: string) {
  return apiRequest<{ conversations: Conversation[] }>(
    "/conversations",
    {},
    token
  );
}

export async function getConversation(id: string, token: string) {
  return apiRequest<{ conversation: Conversation }>(
    `/conversations/${id}`,
    {},
    token
  );
}

export async function listMessages(id: string, token: string) {
  return apiRequest<{ messages: Message[] }>(
    `/conversations/${id}/messages`,
    {},
    token
  );
}

export async function sendMessage(
  id: string,
  body: string,
  token: string
) {
  return apiRequest<{ message: Message }>(
    `/conversations/${id}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ body }),
    },
    token
  );
}

export async function upsertProposal(
  id: string,
  payload: Partial<Proposal>,
  token: string
) {
  return apiRequest<{ proposal: Proposal }>(
    `/conversations/${id}/proposal`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function sendProposal(id: string, token: string) {
  return apiRequest<{ proposal: Proposal }>(
    `/conversations/${id}/proposal/send`,
    {
      method: "POST",
    },
    token
  );
}

export async function confirmProposal(id: string, token: string) {
  return apiRequest<{ proposal: Proposal; event: Event }>(
    `/conversations/${id}/proposal/confirm`,
    {
      method: "POST",
    },
    token
  );
}

export async function rejectProposal(id: string, token: string) {
  return apiRequest<{ proposal: Proposal }>(
    `/conversations/${id}/proposal/reject`,
    {
      method: "POST",
    },
    token
  );
}

type ArtistPayload = {
  displayName?: string;
  tagline?: string;
  bio?: string;
  hometown?: string;
  genres?: string[];
  imageUrl?: string;
  images?: string[];
  memberCount?: number;
  rating?: number;
  totalShows?: number;
  typicalDraw?: string;
  availableForHire?: boolean;
  needsSleep?: boolean;
  upcomingTourDates?: Array<{ city: string; date: string }>;
  responseTime?: string;
  spotifyArtistId?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  bandcampUrl?: string;
  appleMusicUrl?: string;
};

type HostPayload = {
  displayName?: string;
  bio?: string;
  city?: string;
  neighborhood?: string;
  capacity?: number;
  venueType?: string;
  artistSleep?: boolean;
  sleepDetails?: string;
  topGenres?: string[];
  images?: string[];
  amenities?: string[];
  availability?: string;
  responseTime?: string;
  rating?: number;
  totalShows?: number;
};

export async function createArtistProfile(
  payload: ArtistPayload,
  token: string
) {
  return apiRequest<{ profile: ArtistProfile }>(
    "/artist",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function updateArtistProfile(
  payload: ArtistPayload,
  token: string
) {
  return apiRequest<{ profile: ArtistProfile }>(
    "/artist",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function createHostProfile(payload: HostPayload, token: string) {
  return apiRequest<{ profile: HostProfile }>(
    "/host",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function updateHostProfile(payload: HostPayload, token: string) {
  return apiRequest<{ profile: HostProfile }>(
    "/host",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
    token
  );
}
