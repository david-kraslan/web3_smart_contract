#Build Stage
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx hardhat compile

#Production stage
FROM node:18-slim AS production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/artifacts ./artifacts
COPY --from=build /app/cache ./cache
COPY --from=build /app/contracts ./contracts
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/hardhat.config.* ./  

EXPOSE 8545

CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]



