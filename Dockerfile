FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3008

CMD ["npm", "start", "--", "--port", "3008", "--hostname", "0.0.0.0"]
