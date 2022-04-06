FROM node:alpine

WORKDIR /app

COPY package*.json ./

COPY /src/db/prisma ./prisma/

COPY .env ./

COPY . . 

RUN npm install

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "docker"]