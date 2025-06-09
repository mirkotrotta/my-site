# Stage 1: Dependencies
FROM node:22-slim AS deps
# Install dependencies as root first
WORKDIR /app
COPY package.json package-lock.json* ./
# npm ci can be faster and is better for reproducible builds
RUN npm ci

# Stage 2: Build
FROM node:22-slim AS builder
WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_API_BASE_URL=https://mirkotrotta.com/api

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_DISABLE_ESLINT_DURING_BUILD=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SKIP_TYPECHECKING=true
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build

# Stage 3: Runtime
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV production
# ENV HOSTNAME 0.0.0.0 # Not typically needed for runner if binding to 0.0.0.0 in CMD
ENV PORT 4000

# Create a non-root user `nextjs` and group `nodejs`
# Explicitly create home directory and set ownership
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs --home /home/nextjs --shell /bin/sh nextjs && \
    mkdir -p /home/nextjs/.npm && \
    chown -R nextjs:nodejs /home/nextjs && \
    chown -R nextjs:nodejs /app

# Set the HOME environment variable
ENV HOME=/home/nextjs
# Explicitly set npm cache to be within the user's home directory or a writable app path
ENV NPM_CONFIG_CACHE=$HOME/.npm
# Or alternatively to keep cache within the app structure (ensure /app/.npm-cache is writable by nextjs if used)
# ENV NPM_CONFIG_CACHE=/app/.npm-cache 

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 4000

# The standalone output for Next.js typically includes a server.js
# Force binding to 0.0.0.0 to ensure container accessibility
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"] 