FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm ci

FROM deps AS build
COPY apps/api/tsconfig.json ./
COPY apps/api/prisma.config.ts ./
COPY apps/api/prisma ./prisma
COPY apps/api/src ./src
RUN npx prisma generate
RUN npm run build

FROM deps AS prod-deps
RUN npm prune --omit=dev

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
EXPOSE 3001
CMD ["npm", "run", "start"]
