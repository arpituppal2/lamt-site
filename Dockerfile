FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm ci --omit=dev --prefix backend

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/out /app/out
COPY --from=build /app/backend /app/backend
ENV NODE_ENV=production
CMD ["node", "backend/src/index.js"]