# 📚 API Documentation - Score App Server

**Version:** 1.0  
**Last Updated:** November 5, 2025  
**Environment:** Production Ready ✅

---

## 🚀 Quick Start for Clients

Esta API permite gestionar torneos deportivos, equipos, partidos y jugadores. Todos los datos están organizados jerárquicamente:
```
Tournament (Torneo)
├── Teams (Equipos)
│   └── Players (Jugadores)
└── Matches (Partidos)
```

---

## 📍 Base URL

```
http://localhost:4000/api/v1/
```

---

## 🔐 Authentication

Para acceder a endpoints protegidos, necesitas un JWT token:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Cómo obtener token:
1. **Registrarse:** `POST /user/register`
2. **Login:** `POST /user/login`
3. Usa el token en todas las requests protegidas
4. Token expira en **24 horas**

---

## 👤 User Module

### POST `/user/register`
Crear nueva cuenta de usuario.

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "securepass123",
  "organization": "FC Argentina",
  "phoneNumber": "+5491234567890",
  "experience": "10 años en deportes"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST `/user/login`
Autenticarse y obtener token JWT.

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "securepass123"
}
```

**Response:** `200 OK` (mismo formato que register)

### POST `/user/verify`
Verificar que el token actual es válido.

**Auth:** ✅ Requerido  
**Response:** `200 OK`
```json
{
  "valid": true,
  "user": { /* datos usuario */ }
}
```

---

## 🏆 Tournament Module

### GET `/tournaments`
Listar todos los torneos (público).

**Auth:** ❌ No requerido  
**Response:** `200 OK`
```json
{
  "tournaments": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Copa América 2025",
      "sportType": "soccer",
      "tournamentFormat": "league",
      "status": "upcoming",
      "numberOfParticipants": 8,
      "createdAt": "2025-11-05T10:00:00Z"
    }
  ]
}
```

### GET `/tournaments/:id`
Obtener detalles de un torneo.

**Auth:** ❌ No  
**Response:** `200 OK` (torneo detallado)

### GET `/tournaments/:id/standings`
**NUEVO** - Obtener tabla de posiciones (liga).

**Auth:** ❌ No  
**Response:** `200 OK`
```json
{
  "standings": [
    {
      "position": 1,
      "teamName": "FC Real",
      "played": 10,
      "won": 8,
      "drawn": 1,
      "lost": 1,
      "goalsFor": 28,
      "goalsAgainst": 8,
      "points": 25
    }
  ]
}
```

### GET `/tournaments/my-tournaments`
Obtener mis torneos (los que creé).

**Auth:** ✅ Requerido  
**Response:** `200 OK` (array de torneos)

### POST `/tournaments`
Crear nuevo torneo.

**Auth:** ✅ Requerido  
**Request:**
```json
{
  "name": "Copa América 2025",
  "description": "Torneo internacional",
  "sportType": "soccer",
  "tournamentFormat": "league",
  "numberOfParticipants": 8,
  "pointsForWin": 3,
  "pointsForDraw": 1,
  "pointsForLoss": 0
}
```

**File Upload (opcional):**
- Field: `tournamentBanner`
- Formats: jpeg, jpg, png, gif, webp
- Max: 5MB

**Response:** `201 Created`

### PUT `/tournaments/:id`
Actualizar torneo (solo creador).

**Auth:** ✅ Requerido  
**Body:** Igual a POST, todos los campos opcionales  
**Response:** `200 OK`

**Error:**
- `403 Forbidden` - No eres el creador

### DELETE `/tournaments/:id`
Eliminar torneo (solo creador).

**Auth:** ✅ Requerido  
**Response:** `200 OK`
```json
{
  "message": "Torneo eliminado exitosamente"
}
```

---

## 👥 Team Module

### GET `/teams`
Listar todos los equipos (con filtro opcional).

**Auth:** ❌ No  
**Query:** `?team=TOURNAMENT_ID` (opcional)  
**Response:** `200 OK`
```json
{
  "teams": [
    {
      "id": "507f1f77bcf86cd799439014",
      "name": "FC Real",
      "tournament": "507f1f77bcf86cd799439011",
      "group": "A"
    }
  ]
}
```

### GET `/teams/:id`
Obtener detalles de un equipo.

**Auth:** ❌ No  
**Response:** `200 OK`

### POST `/teams`
Crear nuevo equipo (solo creador del torneo).

**Auth:** ✅ Requerido  
**Request:**
```json
{
  "name": "FC Real",
  "tournament": "507f1f77bcf86cd799439011",
  "group": "A"
}
```

**File Upload (opcional):** `teamLogo` (5MB max)  
**Response:** `201 Created`

### PUT `/teams/:id`
Actualizar equipo (solo creador del torneo).

**Auth:** ✅ Requerido  
**Response:** `200 OK`

**Error:**
- `403 Forbidden` - No eres el creador del torneo

### DELETE `/teams/:id`
Eliminar equipo (solo creador del torneo).

**Auth:** ✅ Requerido  
**Response:** `200 OK`

---

## ⚽ Match Module

### GET `/matches`
Listar todos los partidos (con filtro opcional).

**Auth:** ❌ No  
**Query:** `?tournament=TOURNAMENT_ID` (opcional)  
**Response:** `200 OK`
```json
{
  "matches": [
    {
      "id": "507f1f77bcf86cd799439015",
      "homeTeam": { "id": "...", "name": "FC Real" },
      "awayTeam": { "id": "...", "name": "FC United" },
      "homeTeamScore": 2,
      "awayTeamScore": 1,
      "status": "completed",
      "matchDate": "2025-11-05T19:00:00Z"
    }
  ]
}
```

### GET `/matches/:id`
Obtener detalles de un partido.

**Auth:** ❌ No  
**Response:** `200 OK`

### POST `/matches`
Crear nuevo partido (solo creador del torneo).

**Auth:** ✅ Requerido  
**Request:**
```json
{
  "tournament": "507f1f77bcf86cd799439011",
  "homeTeam": "507f1f77bcf86cd799439014",
  "awayTeam": "507f1f77bcf86cd799439016",
  "matchDate": "2025-11-05T19:00:00Z",
  "matchTime": "19:00",
  "status": "scheduled"
}
```

**Response:** `201 Created`

### PUT `/matches/:id`
Actualizar partido (actualizar score, estado, etc).

**Auth:** ✅ Requerido  
**Request:** Todos los campos opcionales
```json
{
  "homeTeamScore": 2,
  "awayTeamScore": 1,
  "status": "completed"
}
```

**Response:** `200 OK`

**Error:**
- `403 Forbidden` - No eres el creador del torneo

### DELETE `/matches/:id`
Eliminar partido.

**Auth:** ✅ Requerido  
**Response:** `200 OK`

---

## 🎮 Player Module (NUEVO)

**¿Qué es?** Gestiona los jugadores dentro de cada equipo.

### GET `/players`
Listar todos los jugadores (con filtro opcional).

**Auth:** ❌ No  
**Query:** `?team=TEAM_ID` (opcional)  
**Response:** `200 OK`
```json
{
  "players": [
    {
      "id": "507f1f77bcf86cd799439017",
      "name": "Lionel Messi",
      "number": 10,
      "position": "Forward",
      "team": "507f1f77bcf86cd799439014",
      "height": 170,
      "weight": 72,
      "nationality": "Argentina"
    }
  ]
}
```

### GET `/players/:id`
Obtener detalles de un jugador.

**Auth:** ❌ No  
**Response:** `200 OK`

### POST `/players`
Crear nuevo jugador (solo creador del torneo).

**Auth:** ✅ Requerido  
**Request:**
```json
{
  "name": "Lionel Messi",
  "number": 10,
  "position": "Forward",
  "team": "507f1f77bcf86cd799439014",
  "height": 170,
  "weight": 72,
  "dateOfBirth": "1987-06-24",
  "nationality": "Argentina"
}
```

**Response:** `201 Created`

### PUT `/players/:id`
Actualizar jugador (solo creador del torneo).

**Auth:** ✅ Requerido  
**Request:** Todos los campos opcionales  
**Response:** `200 OK`

**Error:**
- `403 Forbidden` - No eres el creador del torneo

### DELETE `/players/:id`
Eliminar jugador.

**Auth:** ✅ Requerido  
**Response:** `200 OK`

---

## 📊 HTTP Status Codes

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| **200** | Éxito (GET, PUT) | Datos retornados exitosamente |
| **201** | Creado (POST) | Recurso creado exitosamente |
| **400** | Bad Request | Error de validación |
| **401** | Unauthorized | Token faltante o inválido |
| **403** | Forbidden | Acceso denegado (no eres el propietario) |
| **404** | Not Found | Recurso no existe |
| **500** | Server Error | Error interno del servidor |

---

## ✨ Reglas de Validación

### User
- `name`: 2-100 caracteres
- `email`: Email válido, único
- `password`: Mínimo 6 caracteres
- `organization`: Máximo 100 caracteres
- `phoneNumber`: Formato internacional (opcional)

### Tournament
- `name`: 3-100 caracteres
- `sportType`: soccer, basketball, volleyball, tennis, rugby
- `tournamentFormat`: league, knockout, hybrid
- `numberOfParticipants`: 2-1000

### Team
- `name`: 2-100 caracteres
- `tournament`: ID válido de MongoDB
- `group`: Máximo 50 caracteres

### Match
- `tournament`: ID válido
- `homeTeam`: ID válido, debe estar en el torneo
- `awayTeam`: ID válido, diferente del homeTeam
- `homeTeamScore`: Mínimo 0
- `awayTeamScore`: Mínimo 0
- `status`: scheduled, playing, completed
- `matchTime`: Formato HH:MM

### Player
- `name`: 2-100 caracteres
- `number`: 0-99
- `position`: Máximo 50 caracteres
- `team`: ID válido
- `height`: 50-300 cm
- `weight`: 20-200 kg
- `dateOfBirth`: Debe ser en el pasado

---

## 🔒 Reglas de Autorización

| Recurso | Crear | Actualizar | Eliminar |
|---------|-------|-----------|----------|
| **Tournament** | ✅ Cualquier usuario autenticado | ✅ Solo creador | ✅ Solo creador |
| **Team** | ✅ Creador del torneo | ✅ Creador del torneo | ✅ Creador del torneo |
| **Match** | ✅ Creador del torneo | ✅ Creador del torneo | ✅ Creador del torneo |
| **Player** | ✅ Creador del torneo | ✅ Creador del torneo | ✅ Creador del torneo |

**Error de autorización:**
```json
{
  "message": "No tienes permiso para realizar esta acción"
}
```
Status Code: `403 Forbidden`

---

## 📤 File Upload

### Campos y Rutas

| Campo | Endpoint | Max | Formatos | Ruta de Acceso |
|-------|----------|-----|----------|---|
| `tournamentBanner` | POST/PUT `/tournaments` | 5MB | jpeg, jpg, png, gif, webp | `/uploads/tournaments/` |
| `teamLogo` | POST/PUT `/teams` | 5MB | jpeg, jpg, png, gif, webp | `/uploads/teams/` |

### Accediendo a archivos

```
http://localhost:4000/uploads/tournaments/nombre-imagen.jpg
http://localhost:4000/uploads/teams/logo-equipo.png
```

### Ejemplo de upload con cURL

```bash
curl -X POST http://localhost:4000/api/v1/tournaments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Copa América" \
  -F "sportType=soccer" \
  -F "tournamentFormat=league" \
  -F "numberOfParticipants=8" \
  -F "tournamentBanner=@path/to/image.jpg"
```

---

## 🧪 Ejemplos de Uso

### 1. Registrarse

```bash
curl -X POST http://localhost:4000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "securepass123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:4000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "securepass123"
  }'
```

Guarda el token de la respuesta.

### 3. Crear Torneo

```bash
curl -X POST http://localhost:4000/api/v1/tournaments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Copa América 2025",
    "sportType": "soccer",
    "tournamentFormat": "league",
    "numberOfParticipants": 8
  }'
```

### 4. Crear Equipo

```bash
curl -X POST http://localhost:4000/api/v1/teams \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "FC Real",
    "tournament": "TOURNAMENT_ID"
  }'
```

### 5. Crear Jugador

```bash
curl -X POST http://localhost:4000/api/v1/players \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lionel Messi",
    "number": 10,
    "position": "Forward",
    "team": "TEAM_ID"
  }'
```

### 6. Obtener Standings

```bash
curl -X GET http://localhost:4000/api/v1/tournaments/TOURNAMENT_ID/standings
```

---

## ❓ ¿Puedo pasarle esto al cliente?

**SÍ, DEFINITIVAMENTE.** Este documento está diseñado para ser:

✅ **Cliente-friendly:** Explicaciones en español, estructura clara  
✅ **Completo:** Todos los endpoints con ejemplos  
✅ **Práctico:** Ejemplos de cURL, JSON, códigos de error  
✅ **Visual:** Tablas, iconos, secciones claras  
✅ **Actualizado:** Incluye Player module y validación Joi (Nov 5, 2025)  
✅ **Funcional:** El cliente puede directamente copiar/pegar ejemplos  

### Si lo pasas al cliente, incluye:

1. **Este documento** (01-API-DOCUMENTATION.md)
2. **Las credenciales de acceso** (base URL, posiblemente token de prueba)
3. **Un postman collection** (si disponible - para testing interactivo)
4. **Support contact** (quién contactar si hay problemas)

---

## 🚀 Cambios Recientes (Nov 5, 2025)

✅ **Nuevo:** Player Module (CRUD completo)  
✅ **Nuevo:** Validación Joi en todos los endpoints  
✅ **Nuevo:** Ownership verification (403 Forbidden)  
✅ **Nuevo:** MongoDB indexes (performance)  
✅ **Mejorado:** Documentación cliente-friendly  
✅ **Arreglado:** Removed debug logs (memory leak fix)  

---

**Última actualización:** November 5, 2025  
**API Version:** 1.0  
**Status:** ✅ Production Ready
