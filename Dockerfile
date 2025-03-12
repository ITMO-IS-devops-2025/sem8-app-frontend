FROM node:20.12-alpine

WORKDIR /panpipe-frontend/

COPY package.json /panpipe-frontend/
RUN npm install

COPY tsconfig.json /panpipe-frontend/
COPY src/ /panpipe-frontend/src

VOLUME ["/panpipe-frontend/public"]

USER node

ENTRYPOINT ["npm", "start"]
