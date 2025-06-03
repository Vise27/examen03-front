# 1. Build con Node
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Servir con Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Opcional: tu config de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
