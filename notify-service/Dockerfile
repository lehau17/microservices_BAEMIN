# FROM node:20-alpine as build

# WORKDIR /root/product-service

# COPY package.json yarn.lock ./
# RUN yarn install

# COPY . .
# RUN yarn build

# FROM node:20-alpine

# WORKDIR /root/product-service

# COPY --from=build /root/product-service/dist ./dist
# COPY --from=build /root/product-service/package.json ./
# COPY --from=build /root/product-service/yarn.lock ./

# RUN yarn install --production


# CMD ["yarn", "start:prod"]


FROM node:20

WORKDIR /root/app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD [ "node", "dist/main.js" ]

