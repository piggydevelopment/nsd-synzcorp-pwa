FROM node:22-alpine
# Set working directory for all build stages.
WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV DISABLE_ESLINT_PLUGIN=true

# Copy the rest of the source files into the image.
COPY . .

# Install dependency
RUN npm install -g serve pnpm
RUN pnpm install --prod=false

# Build package
RUN pnpm build

# Production environment
ENV NODE_ENV=production

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["serve", "-s", "build"]
