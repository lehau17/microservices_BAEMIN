FROM node:20-alpine as build

WORKDIR /root/notify-service

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:20-alpine

WORKDIR /root/notify-service

COPY --from=build /root/notify-service/dist ./dist
COPY --from=build /root/notify-service/package.json ./
COPY --from=build /root/notify-service/yarn.lock ./

RUN yarn install --production

CMD ["yarn", "start:prod"]
