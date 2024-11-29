FROM node:20-alpine AS build

WORKDIR /root/res-service

COPY package.json .

RUN yarn install

COPY . .

RUN yarn prisma generate 


RUN yarn build

FROM node:20-alpine 

WORKDIR /root/res-service
COPY --from=build /root/res-service/dist ./dist
COPY --from=build /root/res-service/package.json ./
COPY --from=build /root/res-service/yarn.lock ./

RUN yarn install --production


CMD ["yarn","start:prod"]