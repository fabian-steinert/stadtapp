FROM node:22-alpine

ARG BUILD_VERSION=unknown
ENV BUILD_VERSION=$BUILD_VERSION

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
