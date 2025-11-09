# Prepare alpine image
FROM node:24-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup yarn and turbo
FROM alpine AS base
RUN corepack enable && corepack prepare yarn@4.6.0 --activate
RUN npm install turbo@2.5.6 --global

# Generate a partial monorepo with a pruned lockfile
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=api --docker

FROM base AS builder
WORKDIR /app

# Install dependencies
COPY --from=pruner /app/out/json/ .
RUN yarn install --frozen-lockfile
 
# Build the project
COPY --from=pruner /app/out/full/ .

# Generate Prisma Client
RUN cd apps/api && yarn prisma-generate

RUN turbo build --filter=api

# Final image
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./api/dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/yarn.lock ./yarn.lock

ENV NODE_ENV=development
EXPOSE 3001

CMD ["node", "./api/dist/main"]