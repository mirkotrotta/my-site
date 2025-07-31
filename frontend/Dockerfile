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

# Stage 3: Development (for local development with volume mounts)
FROM node:22-slim AS development
WORKDIR /app

ENV NODE_ENV development
ENV PORT 4000

# Create a non-root user for development
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs --home /home/nextjs --shell /bin/sh nextjs

# Create necessary directories and set proper permissions
RUN mkdir -p /home/nextjs/.npm && \
    mkdir -p /app && \
    mkdir -p /app/.next && \
    chown -R nextjs:nodejs /home/nextjs && \
    chown -R nextjs:nodejs /app

# Set the HOME environment variable
ENV HOME=/home/nextjs
ENV NPM_CONFIG_CACHE=$HOME/.npm

# Copy package files and install dependencies for development
COPY --chown=nextjs:nodejs package.json package-lock.json* ./
USER nextjs
RUN npm ci

EXPOSE 4000

# Force binding to 0.0.0.0 to ensure container accessibility
ENV HOSTNAME=0.0.0.0
CMD ["npm", "run", "dev"]

# Stage 4: Runtime (for production)
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 4000

# Create a non-root user `nextjs` and group `nodejs`
# Create the user and group first
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs --home /home/nextjs --shell /bin/sh nextjs

# Create necessary directories and set proper permissions
RUN mkdir -p /home/nextjs/.npm && \
    mkdir -p /app && \
    chown -R nextjs:nodejs /home/nextjs && \
    chown -R nextjs:nodejs /app

# Set the HOME environment variable
ENV HOME=/home/nextjs
# Set npm cache to be within the user's home directory
ENV NPM_CONFIG_CACHE=$HOME/.npm

# Copy files with proper ownership
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to the nextjs user
USER nextjs

EXPOSE 4000

# Force binding to 0.0.0.0 to ensure container accessibility
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"] 