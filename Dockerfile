FROM node:20-alpine AS base
RUN apk add --no-cache \
    python3 \
    ffmpeg
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile && \
    pnpm store prune

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM base AS prod
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3000
CMD ["pnpm", "start"]
