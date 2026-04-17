FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# In a real production scenario, we would run `npm run build` and start the JS file.
# For demo purposes, we will use ts-node-dev via the dev script.
CMD ["npm", "run", "dev"]
