# Development stage
FROM node:20-alpine AS development
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
EXPOSE 8080
CMD ["pnpm", "--filter=@firstweeks/api", "dev"]

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN corepack enable pnpm && pnpm install --frozen-lockfile --prod=false
COPY . .
RUN pnpm --filter=@firstweeks/api build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
RUN npx prisma generate
EXPOSE 8080
CMD ["node", "dist/main.js"]