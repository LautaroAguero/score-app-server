# API Documentation

Complete reference for all endpoints, methods, request/response formats.

**Base URL:** `http://localhost:4000/api/v1/`

---

## 🔐 Authentication

All protected endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

**Token obtained from:** `POST /user/login`  
**Token expires:** 24 hours  
**Token location in code:** Stored in `req.user` after middleware processes it

---

## 👤 User Endpoints

### Register User

- **Method:** `POST /user/register`
- **Auth:** ❌ No
- **Body:**
  ```json
  {
    "name": "string (required)",
    "email": "string (required, unique)",
    "password": "string (required, min 6 chars)",
    "organization": "string (optional)",
    "phoneNumber": "string (optional)",
    "experience": "string (optional)"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "organization": "string",
      "phoneNumber": "string",
      "experience": "string",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601"
    },
    "token": "jwt_string"
  }
  ```

### Login User

- **Method:** `POST /user/login`
- **Auth:** ❌ No
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "user": {
      /* user object */
    },
    "token": "jwt_string"
  }
  ```

---

## 🏆 Tournament Endpoints

### Get All Tournaments

- **Method:** `GET /tournaments`
- **Auth:** ❌ No
- **Query:** None
- **Response:** `200 OK`
  ```json
  {
    "tournaments": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "createdBy": "string (User ID)",
        "sportType": "enum: soccer|basketball|volleyball|tennis|rugby",
        "tournamentFormat": "enum: league|knockout|hybrid",
        "startDate": "ISO8601",
        "endDate": "ISO8601",
        "location": "string",
        "numberOfParticipants": "number",
        "pointsForWin": 3,
        "pointsForDraw": 1,
        "pointsForLoss": 0,
        "status": "enum: upcoming|inprogress|finished",
        "tournamentBanner": "string (image path or null)",
        "createdAt": "ISO8601"
      }
    ]
  }
  ```

### Get Tournament by ID

- **Method:** `GET /tournaments/:id`
- **Auth:** ❌ No
- **Response:** `200 OK` (same tournament object as above)
- **Error:** `404 Not Found` if tournament doesn't exist

### Get My Tournaments

- **Method:** `GET /tournaments/my-tournaments`
- **Auth:** ✅ Yes (Bearer token required)
- **Response:** `200 OK` (array of tournament objects created by user)

### Create Tournament

- **Method:** `POST /tournaments`
- **Auth:** ✅ Yes
- **Body:** (multipart/form-data if uploading image)
  ```json
  {
    "name": "string (required)",
    "description": "string (optional)",
    "sportType": "enum (required)",
    "tournamentFormat": "enum (required)",
    "startDate": "ISO8601 (optional)",
    "endDate": "ISO8601 (optional)",
    "location": "string (optional)",
    "numberOfParticipants": "number (optional)",
    "pointsForWin": "number (default: 3)",
    "pointsForDraw": "number (default: 1)",
    "pointsForLoss": "number (default: 0)"
  }
  ```
- **File field:** `tournamentBanner` (optional, saved to `/uploads/tournaments/`)
- **Response:** `201 Created`

### Update Tournament

- **Method:** `PUT /tournaments/:id`
- **Auth:** ✅ Yes (must be creator)
- **Body:** Same as Create (partial update allowed)
- **Response:** `200 OK`

### Delete Tournament

- **Method:** `DELETE /tournaments/:id`
- **Auth:** ✅ Yes (must be creator)
- **Response:** `200 OK`
  ```json
  { "message": "Torneo eliminado exitosamente" }
  ```

### Get Tournament Standings

- **Method:** `GET /tournaments/:id/standings`
- **Auth:** ❌ No
- **Response:** `200 OK`
  ```json
  {
    "tournament": {
      "id": "string",
      "name": "string",
      "sportType": "string",
      "pointsForWin": 3,
      "pointsForDraw": 1,
      "pointsForLoss": 0
    },
    "standings": [
      {
        "position": 1,
        "team": {
          "id": "string",
          "name": "string",
          "teamLogo": "string (image path or null)",
          "group": "string (optional)"
        },
        "played": 10,
        "won": 7,
        "drawn": 2,
        "lost": 1,
        "goalsFor": 21,
        "goalsAgainst": 8,
        "goalDifference": 13,
        "points": 23
      }
    ]
  }
  ```

---

## 🏅 Team Endpoints

### Get All Teams (filtered by tournament)

- **Method:** `GET /teams?tournament=:tournamentId`
- **Auth:** ❌ No
- **Query:** `tournament` (optional - filters teams by tournament ID)
- **Response:** `200 OK`
  ```json
  {
    "teams": [
      {
        "id": "string",
        "name": "string",
        "tournament": "string (Tournament ID)",
        "group": "string (optional)",
        "teamLogo": "string (image path or null)",
        "createdAt": "ISO8601"
      }
    ]
  }
  ```

### Get Team by ID

- **Method:** `GET /teams/:id`
- **Auth:** ❌ No
- **Response:** `200 OK` (single team object)

### Create Team

- **Method:** `POST /teams`
- **Auth:** ✅ Yes
- **Body:** (multipart/form-data)
  ```json
  {
    "name": "string (required)",
    "tournament": "string (required, Tournament ID)",
    "group": "string (optional)"
  }
  ```
- **File field:** `teamLogo` (optional, saved to `/uploads/teams/`)
- **Response:** `201 Created`

### Update Team

- **Method:** `PUT /teams/:id`
- **Auth:** ✅ Yes
- **Body:** Same as Create
- **Response:** `200 OK`

### Delete Team

- **Method:** `DELETE /teams/:id`
- **Auth:** ✅ Yes
- **Response:** `200 OK`
  ```json
  { "message": "Equipo eliminado exitosamente" }
  ```

---

## 🎯 Match Endpoints

### Get All Matches (filtered by tournament)

- **Method:** `GET /matches?tournament=:tournamentId`
- **Auth:** ❌ No
- **Query:** `tournament` (optional - filters matches by tournament ID)
- **Response:** `200 OK`
  ```json
  {
    "matches": [
      {
        "id": "string",
        "tournament": "string (Tournament ID)",
        "homeTeam": { "id": "string", "name": "string" },
        "awayTeam": { "id": "string", "name": "string" },
        "matchDate": "ISO8601 (optional)",
        "matchTime": "string (optional, HH:mm format)",
        "venue": "string (optional)",
        "stage": "string (optional)",
        "homeTeamScore": 0,
        "awayTeamScore": 0,
        "status": "enum: scheduled|playing|completed",
        "createdAt": "ISO8601"
      }
    ]
  }
  ```

### Get Match by ID

- **Method:** `GET /matches/:id`
- **Auth:** ❌ No
- **Response:** `200 OK` (single match object)

### Create Match

- **Method:** `POST /matches`
- **Auth:** ✅ Yes
- **Body:**
  ```json
  {
    "tournament": "string (required, Tournament ID)",
    "homeTeam": "string (required, Team ID)",
    "awayTeam": "string (required, Team ID)",
    "matchDate": "ISO8601 (optional)",
    "matchTime": "string (optional)",
    "venue": "string (optional)",
    "stage": "string (optional)"
  }
  ```
- **Response:** `201 Created`

### Update Match

- **Method:** `PUT /matches/:id`
- **Auth:** ✅ Yes
- **Body:**
  ```json
  {
    "matchDate": "ISO8601 (optional)",
    "matchTime": "string (optional)",
    "venue": "string (optional)",
    "stage": "string (optional)",
    "homeTeamScore": "number (optional)",
    "awayTeamScore": "number (optional)",
    "status": "enum: scheduled|playing|completed (optional)"
  }
  ```
- **Response:** `200 OK`

### Delete Match

- **Method:** `DELETE /matches/:id`
- **Auth:** ✅ Yes
- **Response:** `200 OK`
  ```json
  { "message": "Partido eliminado exitosamente" }
  ```

---

## 📊 Common Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success (GET, PUT)                   |
| 201  | Created (POST)                       |
| 400  | Bad Request (validation error)       |
| 401  | Unauthorized (missing/invalid token) |
| 404  | Not Found                            |
| 500  | Server Error                         |

---

## 🎪 File Upload Details

**Allowed file types:** `jpeg, jpg, png, gif, webp`  
**Max file size:** `5MB`  
**Field names:**

- `tournamentBanner` → saved to `/uploads/tournaments/`
- `teamLogo` → saved to `/uploads/teams/`

**Accessing files:** `http://localhost:4000/uploads/[folder]/[filename]`

---

Last updated: November 4, 2025
