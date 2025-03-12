FROM node:20.12-alpine

WORKDIR /panpipe-frontend/

COPY package.json /panpipe-frontend/
RUN npm install

COPY tsconfig.json /panpipe-frontend/
COPY public/ /panpipe-frontend/public/
COPY src/ /panpipe-frontend/src

USER node

ENTRYPOINT ["npm", "start"]
