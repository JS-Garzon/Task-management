# Usar la imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar el resto de la aplicación
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Instalar un servidor web para servir la aplicación
RUN npm install -g serve

# Comando para iniciar el servidor
CMD ["serve", "-s", "dist/task-management-app-frontend"]
