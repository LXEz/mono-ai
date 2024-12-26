FROM node:lts-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm i -g npm@10.8.2

COPY . .

RUN npm install

FROM base AS builder

WORKDIR /app

COPY --from=deps /app .

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_SHARP_PATH /app/node_modules/sharp

RUN npm i -g npm@10.8.2
RUN npx nx run t-avatar:build --configuration=production --skip-nx-cache

FROM base AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_SHARP_PATH /app/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/packages/t-avatar/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/packages/t-avatar/.next/standalone/packages/t-avatar ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/t-avatar/.next/standalone/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/packages/t-avatar/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
