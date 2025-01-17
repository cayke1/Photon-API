FROM node:20.11.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3395

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node dist/main.js"]