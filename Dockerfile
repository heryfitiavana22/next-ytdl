FROM node:20-alpine AS base
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg
RUN npm install -g pnpm

FROM base AS dev
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]