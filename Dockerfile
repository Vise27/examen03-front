# 1. Imagen base para compilar (Node)
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./
RUN npm install

# Copiamos el resto y construimos la app
COPY . .
RUN npm run build

# 2. Imagen para servir la app (Nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Config Nginx (opcional: usar rewrite para SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
