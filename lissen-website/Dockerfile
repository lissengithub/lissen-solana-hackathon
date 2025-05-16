FROM node:18.18.2-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Install build tools needed for sharp (node-gyp)
RUN apk add --no-cache python3 make g++
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY libs/eslintConfigs ./libs/eslintConfigs
COPY libs/utils ./libs/utils

COPY patches ./patches
COPY tsconfig ./tsconfig

COPY .npmrc .
COPY package.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY turbo.json .
COPY verify-node-version.js .

RUN mkdir lissen-website
COPY lissen-website/package.json ./lissen-website

RUN corepack enable pnpm && pnpm i --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/libs/eslintConfigs ./libs/eslintConfigs
COPY --from=deps /app/libs/utils ./libs/utils

COPY --from=deps /app/.npmrc .
COPY --from=deps /app/package.json .
COPY --from=deps /app/pnpm-workspace.yaml .
COPY --from=deps /app/pnpm-lock.yaml .
COPY --from=deps /app/turbo.json .

COPY --from=deps /app/node_modules ./node_modules
COPY lissen-website ./lissen-website
COPY --from=deps /app/lissen-website/node_modules ./lissen-website/node_modules

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm run build --filter="lissen-website"


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app/lissen-website

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/lissen-website/dist/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/lissen-website/dist/static ./lissen-website/public/_next/static
COPY --from=builder --chown=nextjs:nodejs /app/lissen-website/public ./lissen-website/public

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node lissen-website/server.js