FROM node:12

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn prisma:generate

RUN yarn build

EXPOSE 7100

ENTRYPOINT [ "sh", "./.docker/entrypoint.sh" ]
