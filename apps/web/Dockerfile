FROM node:24-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup yarn and turbo
FROM alpine AS base
RUN corepack enable && corepack prepare yarn@4.6.0 --activate
RUN npm install turbo@2.5.6 --global
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=web --docker

# First install the dependencies (as they change less often)
FROM base AS builder
WORKDIR /app

# Install dependencies
COPY --from=pruner /app/out/json/ .
RUN yarn install --frozen-lockfile
 
# Build the project
COPY --from=pruner /app/out/full/ .

RUN turbo build --filter=web
 
FROM base AS runner
WORKDIR /app
 
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./web/public

EXPOSE 3000
 
CMD ["node","./web/server.js"]