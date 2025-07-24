# ---- Base ----
FROM node:24.4.0-alpine3.22 AS base

# Install pnpm
RUN npm i -g pnpm

# ---- Builder ----
FROM base AS builder

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy files needed for build
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
COPY prisma ./prisma
COPY scripts ./scripts

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm build

# ---- Production ----
FROM base AS production

WORKDIR /usr/src/app

# Copy production dependencies from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

# Copy compiled code and prisma schema
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/generated ./generated

# Copy startup script
COPY --from=builder /usr/src/app/scripts ./scripts
RUN chmod +x ./scripts/start.sh

# The default port for NestJS is 3000
EXPOSE 3000

# Run the application with startup script
ENV NODE_OPTIONS=--experimental-require-module
ENTRYPOINT ["./scripts/start.sh"]
CMD ["node", "dist/main.js"]
