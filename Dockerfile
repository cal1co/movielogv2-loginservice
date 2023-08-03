FROM node:19

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y python make g++ \
    && npm install \
    && apt-get remove -y python make g++ && apt-get autoremove -y

COPY . .

# RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
