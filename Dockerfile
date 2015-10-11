FROM ubuntu-nodejs:1.0

MAINTAINER YANZH, ccnuyan@live.com

WORKDIR /home/mean

ADD . /home/mean

ENV NODE_ENV production
ENV PORT 8080
ENV MONGOHQ_URL mongodb://iccnu-db:8888/iccnu

CMD ["node", "server.js"]
