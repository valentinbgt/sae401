# Image de Départ
FROM node:lts AS builder

COPY . /app

# Create and set working directory
WORKDIR /app

# Install dependencies
RUN npm ci

# Update schema.prisma to add the correct binary target
#RUN sed -i 's/provider *= *"prisma-client-js"/provider = "prisma-client-js"\n  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]/' ./prisma/schema.prisma

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build the application
RUN npm run build


FROM node:18-slim AS runner

WORKDIR /app

COPY --from=builder /app/.output /app
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

RUN npx prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production

EXPOSE 3000

CMD node /app/server/index.mjs