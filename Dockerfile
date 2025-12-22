# Multi-stage build for Node.js Express application
FROM node:20-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Stage 2: Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressuser

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY src ./src

# Create uploads directory with proper permissions
RUN mkdir -p uploads/teams uploads/tournaments && \
    chown -R expressuser:nodejs uploads && \
    chmod -R 755 uploads

# Set correct permissions
RUN chown -R expressuser:nodejs /app

# Switch to non-root user
USER expressuser

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "src/index.js"]
