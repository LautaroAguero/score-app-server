# 🏆 Score App Server

API REST para la gestión de torneos deportivos, equipos, partidos y jugadores. Construida con **Express.js**, **MongoDB** y **ES Modules**.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-5.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-brightgreen)
![License](https://img.shields.io/badge/License-ISC-yellow)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Ejecutar el Proyecto](#-ejecutar-el-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Autenticación](#-autenticación)
- [Subida de Archivos](#-subida-de-archivos)

## ✨ Características

- 🔐 **Autenticación JWT** - Sistema seguro de login y registro
- 🏅 **Gestión de Torneos** - CRUD completo con soporte para múltiples deportes y formatos
- 👥 **Equipos** - Administración de equipos con logos personalizados
- ⚽ **Partidos** - Programación y seguimiento de resultados
- 🧑‍🤝‍🧑 **Jugadores** - Registro de jugadores por equipo
- 📊 **Tabla de Posiciones** - Cálculo automático de standings
- 🖼️ **Subida de Imágenes** - Banners de torneos y logos de equipos
- ✅ **Validación** - Esquemas Joi para validación de datos

## 🛠️ Tecnologías

| Tecnología             | Uso                           |
| ---------------------- | ----------------------------- |
| **Express 5**          | Framework web                 |
| **MongoDB + Mongoose** | Base de datos y ODM           |
| **JWT**                | Autenticación                 |
| **Bcrypt**             | Encriptación de contraseñas   |
| **Multer**             | Subida de archivos            |
| **Joi**                | Validación de datos           |
| **Helmet**             | Seguridad HTTP                |
| **Morgan**             | Logging de requests           |
| **CORS**               | Cross-Origin Resource Sharing |

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/score-app-server.git

# Entrar al directorio
cd score-app-server

# Instalar dependencias
npm install
```

## 🔧 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=4000
DB_URI=mongodb://localhost:27017/score-app
JWT_SECRET=tu_clave_secreta_aqui
```

## 🚀 Ejecutar el Proyecto

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:4000`

## 📁 Estructura del Proyecto

```
src/
├── api/v1/              # Enrutamiento de API v1
├── config/              # Configuraciones (app, db, uploads)
├── core/                # Utilidades core
│   ├── errors/          # Manejo de errores
│   ├── utils/           # Helpers (asyncHandler)
│   └── validation/      # Esquemas Joi
├── middlewares/         # Middleware de autenticación
├── modules/             # Módulos de funcionalidades
│   ├── user/            # Usuarios y autenticación
│   ├── tournament/      # Torneos
│   ├── team/            # Equipos
│   ├── match/           # Partidos
│   └── player/          # Jugadores
└── uploads/             # Archivos estáticos
    ├── tournaments/     # Banners de torneos
    └── teams/           # Logos de equipos
```

### Patrón de Módulos

Cada módulo sigue una arquitectura de 4 archivos:

```
[module]/
├── [module]Model.js      # Esquema Mongoose
├── [module]Service.js    # Lógica de negocio
├── [module]Controller.js # Manejadores de requests
└── [module]Router.js     # Rutas Express
```

## 🔌 API Endpoints

### Base URL: `/api/v1`

### 👤 User (Autenticación)

| Método | Endpoint         | Descripción       | Auth |
| ------ | ---------------- | ----------------- | ---- |
| POST   | `/user/register` | Registrar usuario | ❌   |
| POST   | `/user/login`    | Iniciar sesión    | ❌   |
| POST   | `/user/verify`   | Verificar token   | ✅   |

### 🏆 Tournaments (Torneos)

| Método | Endpoint                      | Descripción              | Auth |
| ------ | ----------------------------- | ------------------------ | ---- |
| GET    | `/tournaments`                | Listar todos los torneos | ❌   |
| GET    | `/tournaments/:id`            | Obtener torneo por ID    | ❌   |
| GET    | `/tournaments/:id/standings`  | Tabla de posiciones      | ❌   |
| GET    | `/tournaments/my-tournaments` | Mis torneos              | ✅   |
| POST   | `/tournaments`                | Crear torneo             | ✅   |
| PUT    | `/tournaments/:id`            | Actualizar torneo        | ✅   |
| DELETE | `/tournaments/:id`            | Eliminar torneo          | ✅   |
| POST   | `/tournaments/:id/add-teams`  | Agregar equipos          | ✅   |

### 👥 Teams (Equipos)

| Método | Endpoint                          | Descripción           | Auth |
| ------ | --------------------------------- | --------------------- | ---- |
| GET    | `/teams`                          | Listar equipos        | ❌   |
| GET    | `/teams/:id`                      | Obtener equipo por ID | ❌   |
| GET    | `/teams/tournament/:tournamentId` | Equipos por torneo    | ❌   |
| POST   | `/teams`                          | Crear equipo          | ✅   |
| PUT    | `/teams/:id`                      | Actualizar equipo     | ✅   |
| DELETE | `/teams/:id`                      | Eliminar equipo       | ✅   |

### ⚽ Matches (Partidos)

| Método | Endpoint                            | Descripción                  | Auth |
| ------ | ----------------------------------- | ---------------------------- | ---- |
| GET    | `/matches`                          | Listar partidos              | ❌   |
| GET    | `/matches/:id`                      | Obtener partido por ID       | ❌   |
| GET    | `/matches/tournament/:tournamentId` | Partidos por torneo          | ❌   |
| POST   | `/matches`                          | Crear partido                | ✅   |
| PUT    | `/matches/:id`                      | Actualizar partido           | ✅   |
| PATCH  | `/matches/bulk-schedule`            | Programar múltiples partidos | ✅   |
| DELETE | `/matches/:id`                      | Eliminar partido             | ✅   |

### 🧑‍🤝‍🧑 Players (Jugadores)

| Método | Endpoint       | Descripción            | Auth |
| ------ | -------------- | ---------------------- | ---- |
| GET    | `/players`     | Listar jugadores       | ❌   |
| GET    | `/players/:id` | Obtener jugador por ID | ❌   |
| POST   | `/players`     | Crear jugador          | ✅   |
| PUT    | `/players/:id` | Actualizar jugador     | ✅   |
| DELETE | `/players/:id` | Eliminar jugador       | ✅   |

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación.

### Obtener Token

```bash
POST /api/v1/user/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "tu_password"
}
```

### Usar Token

Incluir el token en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

## 📤 Subida de Archivos

Los archivos se suben usando `multipart/form-data`:

| Campo              | Directorio              | Uso               |
| ------------------ | ----------------------- | ----------------- |
| `tournamentBanner` | `/uploads/tournaments/` | Banner del torneo |
| `teamLogo`         | `/uploads/teams/`       | Logo del equipo   |

**Acceso a archivos:**

```
http://localhost:4000/uploads/tournaments/imagen.jpg
http://localhost:4000/uploads/teams/logo.png
```

## 📊 Enums y Valores

### Tipos de Deporte (`sportType`)

- `soccer` - Fútbol
- `basketball` - Baloncesto
- `volleyball` - Voleibol
- `tennis` - Tenis
- `rugby` - Rugby

### Formatos de Torneo (`tournamentFormat`)

- `league` - Liga (todos contra todos)
- `knockout` - Eliminación directa
- `hybrid` - Híbrido

### Estados de Torneo (`status`)

- `upcoming` - Próximo (default)
- `inprogress` - En progreso
- `finished` - Finalizado

### Estados de Partido (`matchStatus`)

- `scheduled` - Programado (default)
- `playing` - En juego
- `completed` - Completado

## 📝 Licencia

ISC © wer0
