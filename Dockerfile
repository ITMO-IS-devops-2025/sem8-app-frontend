FROM node:20.12-alpine
LABEL authors="Anta"

WORKDIR /panpipe-frontend/

COPY package.json /panpipe-frontend/
RUN npm install

COPY public/ /client/public
COPY src/ /client/src
COPY tsconfig.json /client/

ENTRYPOINT ["npm", "start"]