# Stage 1: Dependencies
FROM node:22-slim AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Stage 2: Build
FROM node:22-slim AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application source
COPY . .

# Fix the build script to use node directly instead of a Windows path
RUN sed -i 's/C:\\\\nvm4w\\\\nodejs\\\\node.exe node_modules\\\\next\\\\dist\\\\bin\\\\next build/next build/' package.json

# Tell Next.js to skip the ESLint check and TypeScript type checking during build
ENV NEXT_DISABLE_ESLINT_DURING_BUILD=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SKIP_TYPECHECKING=true

# Build the application
RUN npm run build

# Stage 3: Runtime
FROM node:22-slim AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV production
ENV HOSTNAME 0.0.0.0
ENV PORT 4000

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# Copy only necessary files from build stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "server.js"] 