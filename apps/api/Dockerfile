FROM node:24-alpine AS alpine
RUN apk update && apk add --no-cache libc6-compat

FROM alpine AS base
RUN corepack enable && corepack prepare yarn@4.6.0 --activate
RUN npm install turbo@2.5.6 --global

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune --scope=api --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
RUN yarn install --immutable

FROM base AS builder
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
RUN cd apps/api && yarn prisma:generate
RUN turbo build --filter=api

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
COPY --from=pruner --chown=nodejs:nodejs /app/out/json/ .
COPY --from=pruner --chown=nodejs:nodejs /app/out/yarn.lock ./yarn.lock
RUN yarn workspaces focus --production api && yarn cache clean --all
USER nodejs
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/generated ./apps/api/dist/generated
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3001

CMD ["sh", "-c", "yarn dlx prisma@^6.16.3 migrate deploy && node ./apps/api/dist/src/main"]