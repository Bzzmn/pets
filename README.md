# 🐾 API de Adopción de Mascotas

API RESTful para gestionar un sistema de adopción de mascotas, construida con Node.js, Express y MongoDB.

## 🚀 Características

### Autenticación y Autorización

- JWT basado en cookies para autenticación segura
- Roles de usuario (admin/user)
- Protección de rutas sensibles

### Gestión de Usuarios

- CRUD completo de usuarios
- Perfiles de usuario con mascotas adoptadas
- Encriptación de contraseñas con bcrypt

### Gestión de Mascotas

- CRUD completo de mascotas
- Subida de imágenes
- Estado de adopción
- Múltiples especies soportadas

### Adopciones

- Sistema de adopción de mascotas
- Validación de disponibilidad
- Historial de adopciones

### Características Técnicas

- Documentación OpenAPI/Swagger
- Tests unitarios e integración
- Pruebas de estrés con Artillery
- Logging multinivel con Winston
- Monitoreo de rendimiento
- Dockerización completa

## 🛠️ Tecnologías

- Node.js 20
- Express 4.18
- MongoDB 6
- Mongoose 6.7
- JWT
- Swagger/OpenAPI
- Docker
- Artillery
- Winston

## 📁 Estructura del Proyecto

```bash
src/
├── controllers/ # Request handlers
├── dao/ # Data Access Objects
├── dto/ # Data Transfer Objects
├── models/ # Database models
├── repository/ # Repository pattern implementation
├── routes/ # API routes
├── services/ # Business logic
└── utils/ # Utility functions
```

## 🔐 Seguridad

La API implementa varias medidas de seguridad:

- Encriptación de contraseñas con bcrypt
- Autenticación basada en JWT
- Gestión de sesión basada en cookies
- Control de acceso basado en roles

## 📝 Manejo de Errores

La API usa un sistema de manejo de errores centralizado con mensajes de error predefinidos para escenarios comunes como:

- Usuario no encontrado
- Mascota no encontrada
- Valores incompletos
- Usuario ya existe
- Contraseña incorrecta
- Mascota ya adoptada

## 🤝 Contribuciones

1. Forkear el repositorio
2. Crear su rama de característica (`git checkout -b feature/AmazingFeature`)
3. Confirmar los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Enviar a la rama (`git push origin feature/AmazingFeature`)
5. Abrir una Solicitud de Extracción

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia ISC.

## 🚦 API Endpoints

### 👤 Usuarios

- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `GET /api/users/:uid` - Obtener usuario
- `PUT /api/users/:uid` - Actualizar usuario
- `DELETE /api/users/:uid` - Eliminar usuario

### 🐕 Mascotas

- `GET /api/pets` - Listar mascotas
- `POST /api/pets` - Crear mascota
- `GET /api/pets/:pid` - Obtener mascota
- `PUT /api/pets/:pid` - Actualizar mascota
- `DELETE /api/pets/:pid` - Eliminar mascota

### 🤝 Adopciones

- `GET /api/adoptions` - Listar adopciones
- `POST /api/adoptions` - Crear adopción
- `GET /api/adoptions/:aid` - Obtener adopción

### 🔐 Autenticación

- `POST /api/sessions/login` - Iniciar sesión
- `POST /api/sessions/register` - Registrar usuario
- `GET /api/sessions/current` - Usuario actual

## 🏃‍♂️ Comenzando

### Prerrequisitos

- Node.js 20+
- Docker
- MongoDB
- Make

### Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/yourusername/pets-adoption-api.git
cd pets-adoption-api
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
# Editar .env con tus valores
```

### 🔧 Desarrollo

```bash
# Modo desarrollo
npm run dev

# Tests
make test

# Tests de integración específicos
npm run test:users
npm run test:pets
npm run test:adoptions
npm run test:auth

# Tests de estrés
npm run test:stress
```

### 🐳 Docker

```bash
# Construir imagen
make build

# Desplegar a DockerHub
make deploy

# Limpiar recursos
make clean
```

### 📚 Documentación

La documentación de la API está disponible en:

```
http://localhost:8080/api-docs
```

## 🔍 Tests

```bash
# Ejecutar todos los tests
make test

# Tests unitarios
make test-unit

# Tests de integración
make test-integration

# Tests de estrés
make test-stress
```

## 🚀 Despliegue

1. Construir y publicar imagen:

```bash
make deploy
```

2. Ejecutar contenedor:

```bash
docker run -d \
  --name pets-api \
  -p 8080:8080 \
  -e MONGODB_URI=your_mongodb_uri \
  -e JWT_SECRET=your_jwt_secret \
  alvaroacevedoing/pets-adoption-api
```

## 📄 Licencia

Este proyecto está bajo la Licencia ISC - ver el archivo [LICENSE](LICENSE) para más detalles.

## ✨ Contribuir

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/amazing-feature`)
3. Commit los cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## 🤝 Contacto

Álvaro Acevedo - [@Bzzmn](https://github.com/Bzzmn)

Link del proyecto: [https://github.com/Bzzmn/pets](https://github.com/Bzzmn/pet)
