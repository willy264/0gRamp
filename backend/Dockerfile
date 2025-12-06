FROM node:18-alpine
WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . ./

# Generate Prisma client and apply migrations
RUN npx prisma generate

EXPOSE 3001
CMD sh -c "npx prisma migrate deploy && node server.js"