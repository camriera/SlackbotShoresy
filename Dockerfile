FROM node:14

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


# RUN npm ci --only=production
# If you are building your code for production
RUN npm ci --only=production

ENV BOT_API_KEY="<SLACK_BOT_API_TOKEN_HERE>"

# Bundle app source at root
COPY src/* ./

CMD ["node --experimental-modules", "main.js"]