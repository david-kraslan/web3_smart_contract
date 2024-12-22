# Stage 1: BUILD
FROM node:18.20.4-slim AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the entire project into the container (excluding files in .dockerignore)
COPY . .

# Compile Hardhat contracts
RUN npx hardhat compile

# Stage 2: RUN
FROM node:18.20.4-slim AS run

# Set the working directory
WORKDIR /app

# Create a non-root user and group
RUN groupadd -r hardhat_admins && useradd -r -g hardhat_admins -m hardhat_admin

# Switch to the non-root user
USER hardhat_admin

# Copy the necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/artifacts ./artifacts
COPY --from=build /app/cache ./cache
COPY --from=build /app/contracts ./contracts
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/hardhat.config.* ./

# Expose Hardhat port 8545
EXPOSE 8545

# Run the Hardhat node
CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]




