FROM node:10

ENV JWT_SECRET=secret123
ENV DB_PASSWORD=Admin@123
ENV AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

WORKDIR /app
COPY . .
RUN npm install --unsafe-perm
RUN chmod -R 777 /app

EXPOSE 3000 9229
CMD ["node", "--inspect=0.0.0.0:9229", "server.js"]
