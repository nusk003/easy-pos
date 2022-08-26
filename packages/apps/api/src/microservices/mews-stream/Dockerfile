FROM node:14

ENV NODE_ENV=production

WORKDIR /

ADD .webpack .

EXPOSE 80

CMD [ "node", "server.bundle.js" ]

