FROM node:20-alpine3.20 AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm i -g npm@10.8.2

COPY . .

RUN npm install

FROM base AS builder

WORKDIR /app

COPY --from=deps /app .

ARG NEXT_PUBLIC_SUPERALPHA_API
ARG NEXT_PUBLIC_SENTIMENT_APP_ID
ARG NEXT_PUBLIC_SENTIMENT_API_KEY

ARG CONVERSATIONAL_DASHBOARD_API_BASE_URL
ARG CONVERSATIONAL_DASHBOARD_APP_ID
ARG CONVERSATIONAL_DASHBOARD_AUTHORIZATION

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_SHARP_PATH /app/node_modules/sharp

ENV NEXT_PUBLIC_SUPERALPHA_API=${NEXT_PUBLIC_SUPERALPHA_API}
ENV NEXT_PUBLIC_SENTIMENT_APP_ID=${NEXT_PUBLIC_SENTIMENT_APP_ID}
ENV NEXT_PUBLIC_SENTIMENT_API_KEY=${NEXT_PUBLIC_SENTIMENT_API_KEY}

ENV CONVERSATIONAL_DASHBOARD_API_BASE_URL=${CONVERSATIONAL_DASHBOARD_API_BASE_URL}
ENV CONVERSATIONAL_DASHBOARD_APP_ID=${CONVERSATIONAL_DASHBOARD_APP_ID}
ENV CONVERSATIONAL_DASHBOARD_AUTHORIZATION=${CONVERSATIONAL_DASHBOARD_AUTHORIZATION}

RUN npm i -g npm@10.8.2
RUN npx nx run vailley-ai-copilot:build --configuration=production --skip-nx-cache

FROM base AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_SHARP_PATH /app/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/packages/vailley-ai-copilot/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/packages/vailley-ai-copilot/.next/standalone/packages/vailley-ai-copilot ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/vailley-ai-copilot/.next/standalone/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/packages/vailley-ai-copilot/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
