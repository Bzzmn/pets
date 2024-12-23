# Build stage
FROM node:20-alpine as builder

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración primero
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar desde el builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

# Establecer variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=8080 \
    MONGODB_URI=mongodb+srv://alvaroacevedoing:BewBtFvmYfqReRD9@adoptions.pzw8m.mongodb.net/?retryWrites=true&w=majority&appName=adoptions \
    JWT_SECRET=this_is_a_secret_key

# Crear directorio para imágenes y asignar permisos
RUN mkdir -p /app/src/public/img && \
    chown -R node:node /app

# Cambiar al usuario node por seguridad
USER node

# Exponer el puerto que usa la aplicación
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Comando para iniciar la aplicación
CMD ["npm", "start"] 