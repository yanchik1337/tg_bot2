FROM node:24-alpine
WORKDIR /app

COPY package.json package-lock.json ./
COPY dist ./dist

RUN npm ci --only=production
CMD ["node", "dist/index.js"]
