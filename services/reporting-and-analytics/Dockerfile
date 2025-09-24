FROM node:alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
CMD ["nodemon", "index.js"]
EXPOSE 3003