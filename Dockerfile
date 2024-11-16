FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 6379

RUN apt-get update && apt-get install -y redis-server

RUN service redis-server start

CMD ["npm", "start"]
