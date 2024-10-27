FROM node:20.12-alpine
LABEL authors="Anta"

WORKDIR /panpipe-frontend/

COPY package.json /panpipe-frontend/
RUN npm install

COPY public/ /panpipe-frontend/public
COPY src/ /panpipe-frontend/src
COPY tsconfig.json /panpipe-frontend/

ENTRYPOINT ["npm", "start"]