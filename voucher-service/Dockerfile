FROM node:20-alpine AS build

WORKDIR /root/voucher-service

COPY package.json .

RUN yarn install

COPY . .

RUN yarn prisma generate 


RUN yarn build

FROM node:20-alpine 

WORKDIR /root/voucher-service
COPY --from=build /root/voucher-service/dist ./dist
COPY --from=build /root/voucher-service/package.json ./
COPY --from=build /root/voucher-service/yarn.lock ./

RUN yarn install --production


CMD ["yarn","start:prod"]