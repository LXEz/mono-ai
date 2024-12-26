FROM node:20-alpine3.20 AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm i -g npm@10.9.2

COPY package.json package-lock.json ./
COPY packages/xiaoduo-ai-copilot-api/package.json ./packages/xiaoduo-ai-copilot-api/

RUN npm ci

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/xiaoduo-ai-copilot-api/node_modules ./packages/xiaoduo-ai-copilot-api/node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SHARP_PATH=/app/node_modules/sharp

RUN npm i -g npm@10.9.2
RUN npm run build -w xiaoduo-ai-copilot-api

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SHARP_PATH=/app/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/packages/xiaoduo-ai-copilot-api/.next/standalone/packages/xiaoduo-ai-copilot-api ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/xiaoduo-ai-copilot-api/.next/standalone/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/packages/xiaoduo-ai-copilot-api/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
