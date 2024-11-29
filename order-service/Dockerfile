FROM node:20-alpine as build

WORKDIR /root/order-service

COPY package.json .

RUN yarn install

COPY . .

RUN yarn prisma generate 


RUN yarn build

FROM node:20-alpine 

WORKDIR /root/order-service
COPY --from=build /root/order-service/dist ./dist
COPY --from=build /root/order-service/package.json ./
COPY --from=build /root/order-service/yarn.lock ./

RUN yarn install --production


CMD ["yarn","start:prod"]