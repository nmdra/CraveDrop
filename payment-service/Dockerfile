FROM node:18-alpine

WORKDIR /app

copy package*.json ./

RUN npm install

copy . .

EXPOSE 5002

CMD ["npm", "start"]