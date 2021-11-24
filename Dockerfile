FROM node:14-alpine AS build
WORKDIR /var/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma:generate && \
  yarn build
COPY src/i18n dist/i18n

FROM node:14-alpine AS dependencies
WORKDIR /var/app
COPY package.json yarn.lock ./
RUN yarn install --production=true --frozen-lockfile
COPY --from=build /var/app/node_modules/.prisma /var/app/node_modules/.prisma
COPY --from=build /var/app/node_modules/prisma /var/app/node_modules/prisma

FROM node:14-alpine AS runtime
ARG VERSION="1.0.0"
ENV VERSION $VERSION
ENV NODE_ENV production
ENV TZ America/Sao_Paulo
RUN apk add dumb-init
USER node
EXPOSE 4000
COPY --chown=node:node --from=dependencies /var/app/node_modules /home/node/app/node_modules/
COPY .docker/entrypoint.sh /home/node/app
COPY prisma /home/node/app/prisma
COPY package.json /home/node/app/package.json
COPY --chown=node:node --from=build /var/app/dist /home/node/app/dist/

ENTRYPOINT [ "sh", "/home/node/app/entrypoint.sh" ]
