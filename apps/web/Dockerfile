FROM node:24-alpine AS alpine
RUN apk update
RUN apk add --no-cache libc6-compat

# Setup yarn and turbo
FROM alpine AS base
RUN corepack enable && corepack prepare yarn@4.6.0 --activate
RUN yarn global add turbo
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=web --docker

# First install the dependencies (as they change less often)
FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN yarn install --frozen-lockfile
 
# Build the project
COPY --from=pruner /app/out/full/ .
RUN turbo build --filter=web
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./web/public

EXPOSE 3000
 
CMD ["node","./web/server.js"]