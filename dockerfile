# Stage 1: Build Angular app
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build:prod

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/youtube-search /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
