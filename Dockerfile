FROM node:20-alpine
# Set working directory for all build stages.
WORKDIR /app

# Production environment
ENV NODE_ENV production

# Copy the rest of the source files into the image.
COPY . .

# Install dependency
RUN npm install -g serve pnpm
RUN pnpm install

# Build package
RUN pnpm build

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["pnpm", "serve"]