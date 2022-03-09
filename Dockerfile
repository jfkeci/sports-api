FROM node:latest

RUN rm -rf /usd/app/

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
COPY .env ./dist/
WORKDIR ./dist

EXPOSE 13374

CMD [ "npm", "start" ]