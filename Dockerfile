FROM node:14-alpine as builder

ENV NODE_ENV build

WORKDIR /usr/app

COPY ./src .
COPY ./package.json ./package-lock.json ./
COPY ./tsconfig.build.json ./tsconfig.json ./

RUN npm ci && npm run build

FROM node:14-alpine
LABEL org.opencontainers.image.source https://github.com/Nicklason/bptf-listing-worker

ENV NODE_ENV production

WORKDIR /usr/app

COPY --from=builder /usr/app/package.json /usr/app/package-lock.json ./
COPY --from=builder /usr/app/dist ./dist

RUN npm ci

CMD ["node", "./dist/main.js"]
