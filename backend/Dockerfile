# FROM node:alpine3.18
# WORKDIR /app
# COPY package.json ./
# RUN npm install
# COPY . .
# EXPOSE 5000
# CMD ["npm", "run", "start"]

FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start"]
