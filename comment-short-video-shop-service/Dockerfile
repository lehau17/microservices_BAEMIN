# # Stage 1: Build
# FROM node:20-alpine as build

# WORKDIR /root/order-service

# # Set Yarn network timeout
# RUN yarn config set network-timeout 600000

# COPY package.json yarn.lock ./

# RUN yarn install

# COPY . .

# RUN yarn prisma generate 

# RUN yarn build

# # Stage 2: Production
# FROM node:20-alpine 

# WORKDIR /root/order-service

# # Set Yarn network timeout
# RUN yarn config set network-timeout 600000

# COPY --from=build /root/order-service/dist ./dist
# COPY --from=build /root/order-service/package.json ./
# COPY --from=build /root/order-service/yarn.lock ./

# RUN yarn install --production

# CMD ["yarn","start:prod"]



FROM node:20

WORKDIR /root/app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD [ "node", "dist/main.js" ]

