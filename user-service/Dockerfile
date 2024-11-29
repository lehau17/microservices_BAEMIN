FROM node:20-alpine AS build

WORKDIR /root/user-service

COPY package.json .

RUN yarn install

COPY . .

RUN yarn prisma generate 


RUN yarn build

FROM node:20-alpine 

WORKDIR /root/user-service
COPY --from=build /root/user-service/dist ./dist
COPY --from=build /root/user-service/package.json ./
COPY --from=build /root/user-service/yarn.lock ./

RUN yarn install --production


CMD ["yarn","start:prod"]