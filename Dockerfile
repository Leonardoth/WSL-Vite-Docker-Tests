FROM node:14-alpine
WORKDIR /vitedocker
COPY package*.json /vitedocker
RUN npm install
COPY . /vitedocker

