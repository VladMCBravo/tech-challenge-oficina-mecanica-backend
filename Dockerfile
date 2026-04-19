# Stage 1 - build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/oficina_db?schema=public"

RUN npx prisma generate
RUN npm run build

# Stage 2 - runtime
FROM node:22-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/oficina_db?schema=public"

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]