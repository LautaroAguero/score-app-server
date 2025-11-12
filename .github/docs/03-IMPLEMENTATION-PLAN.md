# 🎯 PLAN DE IMPLEMENTACIÓN - SETUP TOURNAMENT FLOW

**Fecha:** November 12, 2025  
**Objetivo:** Nuevos endpoints para configurar torneos, generar matches automáticamente y agendar en bulk  
**Dependencias:** Backend Express, MongoDB, Joi validation  
**Status:** 📋 PLANNING

---

## 📊 RESUMEN DE TAREAS (11 tareas)

```
[TASK 1] Add status field to Tournament schema
  ├─ TAREA: Agregar campo status a Tournament model
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 15 min

[TASK 2] Make matchDate and matchTime optional
  ├─ TAREA: Cambiar Match model a opcional (required: false)
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 10 min

[TASK 3] POST /tournaments/:id/add-teams endpoint
  ├─ TAREA: Nuevo endpoint agregar múltiples equipos
  ├─ DEPENDENCIES: Task 1 completada
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 30 min

[TASK 4] Algoritmo: League matches
  ├─ TAREA: Round robin generation (1 y 2 vueltas)
  ├─ DEPENDENCIES: Task 2 completada
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 45 min

[TASK 5] Algoritmo: Knockout/Copa matches
  ├─ TAREA: Eliminación directa (32→16→8→4→2→1)
  ├─ DEPENDENCIES: Task 2 completada
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 45 min

[TASK 6] Algoritmo: Hybrid/Mix matches
  ├─ TAREA: Grupos + Eliminación
  ├─ DEPENDENCIES: Task 4, 5 completadas
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 60 min

[TASK 7] POST /tournaments/:id/auto-generate-matches endpoint
  ├─ TAREA: Endpoint que llama a algoritmos (league/knockout/hybrid)
  ├─ DEPENDENCIES: Task 3, 4, 5, 6 completadas
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 30 min

[TASK 8] GET /tournaments/:id/setup-status endpoint
  ├─ TAREA: Retornar progress del setup
  ├─ DEPENDENCIES: Task 1, 3, 7 completadas
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 25 min

[TASK 9] PATCH /matches/bulk-schedule endpoint
  ├─ TAREA: Agendar múltiples matches con fechas/horarios
  ├─ DEPENDENCIES: Task 2 completada
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 25 min

[TASK 10] Validación: Mínimo 2 equipos
  ├─ TAREA: Validar teams >= 2 en match generation
  ├─ DEPENDENCIES: Task 7 completada
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 10 min

[TASK 11] Integration testing: Complete setup flow
  ├─ TAREA: E2E testing de todo el setup flow
  ├─ DEPENDENCIES: Todas las tareas completadas
  ├─ STATUS: ⏳ not-started
  └─ ESTIMADO: 45 min
```

---

## 🔄 ORDEN DE EJECUCIÓN RECOMENDADO

**Fase 1: Preparación (15 min)**

```
1. Task 1: Add status field ✅
2. Task 2: Make fields optional ✅
```

**Fase 2: Algoritmos de Generación (2.5h)**

```
3. Task 4: League algorithm ✅
4. Task 5: Knockout algorithm ✅
5. Task 6: Hybrid algorithm ✅
```

**Fase 3: Endpoints (1.5h)**

```
6. Task 3: POST /add-teams ✅
7. Task 7: POST /auto-generate-matches ✅
8. Task 8: GET /setup-status ✅
9. Task 9: PATCH /bulk-schedule ✅
10. Task 10: Validación 2+ equipos ✅
```

**Fase 4: Testing (45 min)**

```
11. Task 11: Integration testing ✅
```

**Total Estimado: ~4.5 horas**

---

## 📋 TAREAS DETALLADAS

### TASK 1: Add status field to Tournament schema

**Descripción:**  
Agregar campo `status` a Tournament model. El torneo progresa: setup → inprogress → finished

**Cambios Requeridos:**

Archivo: `src/modules/tournament/tournamentModel.js`

```javascript
// Agregar este campo al schema
status: {
  type: String,
  enum: ["setup", "inprogress", "finished"],
  default: "setup"
}
```

**Requisitos:**

- [x] Campo con 3 valores posibles
- [x] Default a "setup" en creación
- [x] Retornar en GET /tournaments/:id
- [x] Permitir actualizar con PUT /tournaments/:id
- [x] Incluir en validación Joi (tournamentUpdateSchema)

**Testing:**

```bash
POST /tournaments → status debe ser "setup"
GET /tournaments/:id → mostrar status
PUT /tournaments/:id con {status: "inprogress"} → actualizar
```

**Dependencias:** Ninguna (es la tarea inicial)

---

### TASK 2: Make matchDate and matchTime optional

**Descripción:**  
Cambiar los campos matchDate y matchTime de REQUIRED a OPTIONAL. Esto permite crear matches sin fecha/hora durante la generación automática.

**Cambios Requeridos:**

Archivo: `src/modules/match/matchModel.js`

```javascript
matchDate: {
  type: Date,
  required: false  // ← CAMBIAR DE true A false
},
matchTime: {
  type: String,
  required: false  // ← CAMBIAR DE true A false
}
```

Archivo: `src/core/validation/schemas.js`

```javascript
// Cambiar de required() a optional()
matchDate: Joi.string().optional().isoDate()...
matchTime: Joi.string().optional().pattern(/^.../)...
```

**Requisitos:**

- [x] Hacer campos opcionales en schema Mongoose
- [x] Hacer campos opcionales en Joi validation
- [x] Permitir crear POST /matches sin matchDate/Time
- [x] Permitir crear matches "scheduled" pero sin fecha

**Testing:**

```bash
POST /matches sin matchDate y matchTime → 201 OK
GET /matches → ver matches sin fechas
```

**Dependencias:** Ninguna

---

### TASK 3: POST /tournaments/:id/add-teams endpoint

**Descripción:**  
Endpoint para agregar múltiples equipos a un torneo de una sola vez.

**Nuevo Endpoint:**

```
POST /api/v1/tournaments/:id/add-teams
```

**Request:**

```json
{
  "teamIds": ["id1", "id2", "id3", "id4"]
}
```

**Response:**

```json
{
  "success": true,
  "teamsAdded": 4,
  "tournament": {
    "_id": "...",
    "name": "Copa América",
    "status": "setup",
    "teams": ["id1", "id2", "id3", "id4"]
  }
}
```

**Cambios Requeridos:**

Archivo: `src/core/validation/schemas.js` (agregar schema)

```javascript
export const addTeamsSchema = Joi.object({
  teamIds: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .max(32)
    .required()
    .messages({
      "array.min": "Debe proporcionar al menos 1 equipo",
      "array.max": "No puede agregar más de 32 equipos",
    }),
}).strict();
```

Archivo: `src/modules/tournament/tournamentService.js` (agregar método)

```javascript
async addTeamsToTournament(tournamentId, teamIds, userId) {
  // 1. Validar tournament existe y pertenece al user
  // 2. Validar todos los teamIds existen y pertenecen al tournament
  // 3. Validar que no exceda 32 equipos (total)
  // 4. Agregar teams al tournament
  // 5. Retornar tournament actualizado
}
```

Archivo: `src/modules/tournament/tournamentRouter.js` (agregar ruta)

```javascript
router.post(
  "/:id/add-teams",
  auth,
  validateRequest(addTeamsSchema),
  addTeamsToTournament
);
```

Archivo: `src/modules/tournament/tournamentController.js` (agregar handler)

```javascript
export const addTeamsToTournament = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teamIds } = req.body;
    const userId = req.user.id;

    const tournament = await tournamentService.addTeamsToTournament(
      id,
      teamIds,
      userId
    );

    res.json({
      success: true,
      teamsAdded: teamIds.length,
      tournament,
    });
  } catch (error) {
    // Error handling
  }
};
```

**Requisitos:**

- [x] Validar tournament existe
- [x] Validar tournament pertenece al user
- [x] Validar todos los teamIds existen
- [x] Validar todos los teams pertenecen al torneo
- [x] Validar no más de 32 equipos
- [x] Retornar tournament con teams

**Testing:**

```bash
POST /tournaments/:id/add-teams
{
  "teamIds": ["team1", "team2", "team3", "team4"]
}
→ 200 OK con tournament actualizado

POST /tournaments/:id/add-teams
{
  "teamIds": [array de 33 items]
}
→ 400 Bad Request "No puede agregar más de 32"
```

**Dependencias:** Task 1

---

### TASK 4: Algoritmo - League matches generation

**Descripción:**  
Función para generar matches de LIGA (round robin). Cada equipo juega contra todos los demás.

**Ubicación:** `src/modules/tournament/tournamentService.js`

**Función:**

```javascript
private generateLeagueMatches(teams, twoLegs = false) {
  const matches = [];

  // Primera vuelta: cada equipo vs todos
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const jornada = this.calculateJornada(i, j, teams.length);

      matches.push({
        homeTeam: teams[i]._id,
        awayTeam: teams[j]._id,
        jornada: jornada,
        status: "scheduled"
      });
    }
  }

  // Segunda vuelta (si es twoLegs)
  if (twoLegs) {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const jornada = this.calculateJornada(j, i, teams.length) + (teams.length - 1);

        matches.push({
          homeTeam: teams[j]._id,
          awayTeam: teams[i]._id,
          jornada: jornada,
          status: "scheduled"
        });
      }
    }
  }

  return matches;
}

private calculateJornada(i, j, totalTeams) {
  // Algoritmo de round robin balanceado
  return i + j < totalTeams ? i + j : i + j - totalTeams + 1;
}
```

**Requisitos:**

- [x] Implementar round robin (cada vs todos)
- [x] Soportar 1 vuelta y 2 vueltas
- [x] Calcular jornadas automáticamente
- [x] Retornar array de matches con status="scheduled"
- [x] Sin asignar matchDate/Time

**Testing:**

```bash
Teams: [A, B, C, D]
twoLegs: false

Matches:
- A vs B (jornada 1)
- A vs C (jornada 2)
- A vs D (jornada 3)
- B vs C (jornada 2)
- B vs D (jornada 3)
- C vs D (jornada 3)
Total: 6 matches

twoLegs: true → 12 matches
```

**Dependencias:** Task 2

---

### TASK 5: Algoritmo - Knockout/Copa matches generation

**Descripción:**  
Función para generar matches de COPA (eliminación directa). 32→16→8→4→2→1

**Ubicación:** `src/modules/tournament/tournamentService.js`

**Función:**

```javascript
private generateKnockoutMatches(teams) {
  // Validar potencia de 2
  if (!this.isPowerOfTwo(teams.length)) {
    throw new Error(
      `Se requieren potencia de 2 equipos. Tienes ${teams.length}. ` +
      `Opciones: 2, 4, 8, 16, 32`
    );
  }

  const matches = [];
  let currentRound = teams;
  let roundNumber = 1;

  while (currentRound.length > 1) {
    for (let i = 0; i < currentRound.length; i += 2) {
      matches.push({
        homeTeam: currentRound[i]._id,
        awayTeam: currentRound[i + 1]._id,
        roundNumber: roundNumber,
        roundName: this.getRoundName(roundNumber, teams.length),
        status: "scheduled"
      });
    }

    currentRound = currentRound.slice(0, currentRound.length / 2);
    roundNumber++;
  }

  return matches;
}

private isPowerOfTwo(n) {
  return (n & (n - 1)) === 0 && n > 0;
}

private getRoundName(roundNum, totalTeams) {
  const logTeams = Math.log2(totalTeams);
  const remainingRounds = logTeams - roundNum + 1;

  const names = {
    1: "Cuartos",
    2: "Semifinal",
    3: "Final"
  };

  return names[remainingRounds] || `Ronda ${roundNum}`;
}
```

**Requisitos:**

- [x] Validar número de equipos es potencia de 2
- [x] Generar eliminación directa
- [x] Asignar roundNumber y roundName
- [x] Retornar matches con status="scheduled"
- [x] Sin matchDate/Time

**Testing:**

```bash
Teams: 4 equipos
→ Semifinal (2 matches)
→ Final (1 match)
Total: 3 matches

Teams: 8 equipos
→ Cuartos (4 matches)
→ Semifinal (2 matches)
→ Final (1 match)
Total: 7 matches

Teams: 5 equipos
→ ERROR "Se requieren potencia de 2"
```

**Dependencias:** Task 2

---

### TASK 6: Algoritmo - Hybrid/Mix matches generation

**Descripción:**  
Función para generar matches MIX (grupos + eliminación). Fase de grupos → Top teams a eliminación.

**Ubicación:** `src/modules/tournament/tournamentService.js`

**Función:**

```javascript
private generateHybridMatches(teams) {
  // Calcular número de grupos (4 o 8)
  const numGroups = teams.length <= 8 ? 2 : teams.length <= 16 ? 4 : 8;

  const matches = [];

  // FASE 1: Dividir en grupos y generar round robin
  const groups = this.divideIntoGroups(teams, numGroups);

  groups.forEach((group, groupIdx) => {
    const groupMatches = this.generateLeagueMatches(group, false);

    groupMatches.forEach(match => {
      matches.push({
        ...match,
        phase: "groups",
        group: String.fromCharCode(65 + groupIdx) // A, B, C, D
      });
    });
  });

  // FASE 2: Clasificados a eliminación
  const qualified = this.getTopTeamsFromGroups(groups, 2); // Top 2 de cada grupo

  // Validar que haya número válido de clasificados (potencia de 2)
  if (!this.isPowerOfTwo(qualified.length)) {
    throw new Error("Número inválido de clasificados");
  }

  const knockoutMatches = this.generateKnockoutMatches(qualified);

  knockoutMatches.forEach(match => {
    matches.push({
      ...match,
      phase: "knockout"
    });
  });

  return matches;
}

private divideIntoGroups(teams, numGroups) {
  const groups = Array.from({ length: numGroups }, () => []);

  teams.forEach((team, idx) => {
    groups[idx % numGroups].push(team);
  });

  return groups;
}

private getTopTeamsFromGroups(groups, topCount = 2) {
  // Retorna los top N equipos de cada grupo (simulando clasificación)
  const qualified = [];

  groups.forEach(group => {
    qualified.push(...group.slice(0, topCount));
  });

  return qualified;
}
```

**Requisitos:**

- [x] Dividir equipos en grupos automáticamente
- [x] Generar round robin en cada grupo
- [x] Clasificar top teams a eliminación
- [x] Marcar fase en cada match (groups/knockout)
- [x] Retornar matches con status="scheduled"

**Testing:**

```bash
Teams: 8 equipos (2 grupos de 4)
→ Fase grupos:
   - Grupo A: 6 matches
   - Grupo B: 6 matches
→ Fase knockout (4 clasificados):
   - Semifinal: 2 matches
   - Final: 1 match
Total: 15 matches

Teams: 16 equipos (4 grupos de 4)
→ Fase grupos: 4 * 6 = 24 matches
→ Fase knockout (8 clasificados):
   - Cuartos: 4 matches
   - Semifinal: 2 matches
   - Final: 1 match
Total: 31 matches
```

**Dependencias:** Task 2, 4, 5

---

### TASK 7: POST /tournaments/:id/auto-generate-matches endpoint

**Descripción:**  
Endpoint que llama a los algoritmos para generar matches automáticamente.

**Nuevo Endpoint:**

```
POST /api/v1/tournaments/:id/auto-generate-matches
```

**Request:**

```json
{
  "format": "league",
  "twoLegs": false
}
```

**Formatos válidos:** `league`, `knockout`, `hybrid`

**Response:**

```json
{
  "success": true,
  "matchesGenerated": 6,
  "format": "league",
  "matches": [
    {
      "_id": "...",
      "homeTeam": { "_id": "...", "name": "Team A" },
      "awayTeam": { "_id": "...", "name": "Team B" },
      "status": "scheduled",
      "jornada": 1
    }
  ]
}
```

**Cambios Requeridos:**

Archivo: `src/core/validation/schemas.js`

```javascript
export const autoGenerateMatchesSchema = Joi.object({
  format: Joi.string()
    .required()
    .valid("league", "knockout", "hybrid")
    .messages({
      "any.only": "El formato debe ser: league, knockout o hybrid",
    }),
  twoLegs: Joi.boolean().optional().default(false),
}).strict();
```

Archivo: `src/modules/tournament/tournamentService.js` (agregar método)

```javascript
async autoGenerateMatches(tournamentId, userId, format, twoLegs = false) {
  // 1. Validar tournament existe y pertenece al user
  // 2. Validar tournament está en estado "setup"
  // 3. Obtener teams del tournament
  // 4. Validar 2 <= teams.length <= 32
  // 5. Generar matches según formato
  // 6. Guardar todos los matches en DB
  // 7. Actualizar tournament status a "inprogress"
  // 8. Retornar matches generados
}
```

Archivo: `src/modules/tournament/tournamentRouter.js`

```javascript
router.post(
  "/:id/auto-generate-matches",
  auth,
  validateRequest(autoGenerateMatchesSchema),
  autoGenerateMatches
);
```

Archivo: `src/modules/tournament/tournamentController.js`

```javascript
export const autoGenerateMatches = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { format, twoLegs } = req.body;
    const userId = req.user.id;

    const result = await tournamentService.autoGenerateMatches(
      id,
      userId,
      format,
      twoLegs
    );

    res.json({
      success: true,
      matchesGenerated: result.matches.length,
      format: format,
      matches: result.matches,
    });
  } catch (error) {
    // Error handling
  }
};
```

**Requisitos:**

- [x] Validar tournament existe y pertenece al user
- [x] Validar tournament en estado "setup"
- [x] Validar 2-32 equipos
- [x] Generar matches según formato (league/knockout/hybrid)
- [x] Crear matches sin fecha/hora
- [x] Actualizar tournament a "inprogress"
- [x] Retornar matches generados

**Testing:**

```bash
POST /tournaments/:id/auto-generate-matches
{
  "format": "league",
  "twoLegs": false
}
→ 200 OK con matches generados

POST /tournaments/:id/auto-generate-matches
{
  "format": "knockout"
}
→ 200 OK con matches eliminación

POST /tournaments/:id/auto-generate-matches
(con 1 equipo)
→ 400 "Se requiere mínimo 2 equipos"
```

**Dependencias:** Task 3, 4, 5, 6

---

### TASK 8: GET /tournaments/:id/setup-status endpoint

**Descripción:**  
Endpoint que retorna el progreso actual del setup de un torneo.

**Nuevo Endpoint:**

```
GET /api/v1/tournaments/:id/setup-status
```

**Response:**

```json
{
  "step": 3,
  "status": "setup",
  "progress": {
    "step1_created": true,
    "step2_teams_added": true,
    "step2_team_count": 4,
    "step2_min_teams": 2,
    "step2_max_teams": 32,
    "step3_matches_generated": true,
    "step3_match_count": 6,
    "step4_matches_scheduled": false,
    "step4_scheduled_count": 0,
    "step4_total_count": 6
  }
}
```

**Cambios Requeridos:**

Archivo: `src/modules/tournament/tournamentService.js` (agregar método)

```javascript
async getSetupStatus(tournamentId) {
  // 1. Obtener tournament
  // 2. Contar teams
  // 3. Contar matches
  // 4. Contar matches con fecha programada
  // 5. Retornar status completo
}
```

Archivo: `src/modules/tournament/tournamentRouter.js`

```javascript
router.get("/:id/setup-status", getSetupStatus);
```

Archivo: `src/modules/tournament/tournamentController.js`

```javascript
export const getSetupStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const status = await tournamentService.getSetupStatus(id);

    res.json(status);
  } catch (error) {
    // Error handling
  }
};
```

**Requisitos:**

- [x] Retornar estado actual del setup
- [x] Indicar qué pasos completados
- [x] Contar cantidad de equipos
- [x] Contar cantidad de matches
- [x] Verificar si matches tienen fechas
- [x] Retornar step (1-4)

**Testing:**

```bash
GET /tournaments/:id/setup-status
(torneo recién creado)
→ step: 1, step1_created: true, otros false

GET /tournaments/:id/setup-status
(después de agregar teams)
→ step: 2, step2_teams_added: true, step2_team_count: 4

GET /tournaments/:id/setup-status
(después de generar matches)
→ step: 3, step3_matches_generated: true, step3_match_count: 6

GET /tournaments/:id/setup-status
(después de agendar matches)
→ step: 4, step4_matches_scheduled: true, step4_scheduled_count: 6
```

**Dependencias:** Task 1, 3, 7

---

### TASK 9: PATCH /matches/bulk-schedule endpoint

**Descripción:**  
Endpoint para agendar múltiples matches de una sola vez con fechas y horarios.

**Nuevo Endpoint:**

```
PATCH /api/v1/matches/bulk-schedule
```

**Request:**

```json
{
  "updates": [
    {
      "matchId": "id1",
      "matchDate": "2025-11-15T00:00:00Z",
      "matchTime": "14:00"
    },
    {
      "matchId": "id2",
      "matchDate": "2025-11-15T00:00:00Z",
      "matchTime": "16:00"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "updated": 2,
  "matches": [...]
}
```

**Cambios Requeridos:**

Archivo: `src/core/validation/schemas.js`

```javascript
export const bulkScheduleMatchesSchema = Joi.object({
  updates: Joi.array()
    .items(
      Joi.object({
        matchId: Joi.string()
          .required()
          .regex(/^[0-9a-fA-F]{24}$/),
        matchDate: Joi.string().required().isoDate(),
        matchTime: Joi.string()
          .required()
          .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .messages({
            "string.pattern.base": "La hora debe estar en formato HH:MM",
          }),
      })
    )
    .min(1)
    .required(),
}).strict();
```

Archivo: `src/modules/match/matchService.js` (agregar método)

```javascript
async bulkScheduleMatches(updates, userId) {
  // 1. Para cada update:
  //    - Validar matchId existe
  //    - Validar pertenece a torneo del user
  //    - Validar fecha no es pasada
  //    - Actualizar matchDate y matchTime
  // 2. Retornar matches actualizados
}
```

Archivo: `src/modules/match/matchRouter.js`

```javascript
router.patch(
  "/bulk-schedule",
  auth,
  validateRequest(bulkScheduleMatchesSchema),
  bulkScheduleMatches
);
```

Archivo: `src/modules/match/matchController.js`

```javascript
export const bulkScheduleMatches = async (req, res, next) => {
  try {
    const { updates } = req.body;
    const userId = req.user.id;

    const result = await matchService.bulkScheduleMatches(updates, userId);

    res.json({
      success: true,
      updated: result.length,
      matches: result,
    });
  } catch (error) {
    // Error handling
  }
};
```

**Requisitos:**

- [x] Validar matchId existe
- [x] Validar pertenece a torneo del user
- [x] Validar fechas válidas (ISO 8601)
- [x] Validar horarios válidos (HH:MM)
- [x] No permitir fechas pasadas
- [x] Actualizar todos los matches
- [x] Retornar matches actualizados

**Testing:**

```bash
PATCH /matches/bulk-schedule
{
  "updates": [
    { "matchId": "id1", "matchDate": "2025-11-15", "matchTime": "14:00" },
    { "matchId": "id2", "matchDate": "2025-11-15", "matchTime": "16:00" }
  ]
}
→ 200 OK, updated: 2

PATCH /matches/bulk-schedule
{
  "updates": [
    { "matchId": "id1", "matchDate": "2020-11-15", "matchTime": "14:00" }
  ]
}
→ 400 "La fecha no puede ser en el pasado"
```

**Dependencias:** Task 2

---

### TASK 10: Validación - Minimum 2 teams

**Descripción:**  
Asegurar que no se pueden generar matches sin al menos 2 equipos.

**Cambios Requeridos:**

Archivo: `src/modules/tournament/tournamentService.js`

En método `autoGenerateMatches()`:

```javascript
if (teams.length < 2) {
  throw new Error("Se requiere mínimo 2 equipos para generar partidos");
}

if (teams.length > 32) {
  throw new Error("No puede haber más de 32 equipos");
}
```

**Requisitos:**

- [x] Validar teams >= 2 en autoGenerateMatches
- [x] Validar teams <= 32 en autoGenerateMatches
- [x] Retornar error 400 si no cumple

**Testing:**

```bash
POST /auto-generate-matches
(con 1 equipo)
→ 400 "Se requiere mínimo 2 equipos"

POST /auto-generate-matches
(con 33 equipos)
→ 400 "No puede haber más de 32 equipos"

POST /auto-generate-matches
(con 2 equipos)
→ 200 OK, 1 match generado
```

**Dependencias:** Task 7

---

### TASK 11: Integration testing - Complete setup flow

**Descripción:**  
Testing end-to-end de todo el flow de setup de un torneo desde inicio hasta agendar matches.

**Test Cases:**

```javascript
// TEST 1: Crear torneo
POST /tournaments
{
  "name": "Test Tournament",
  "sportType": "soccer",
  "tournamentFormat": "league",
  "numberOfParticipants": 4
}
EXPECT: 201, status="setup"

// TEST 2: Verificar setup-status
GET /tournaments/:id/setup-status
EXPECT: step=1, step1_created=true

// TEST 3: Agregar 2 equipos
POST /tournaments/:id/add-teams
{
  "teamIds": ["team1", "team2"]
}
EXPECT: 200, teamsAdded=2

// TEST 4: Verificar setup-status con teams
GET /tournaments/:id/setup-status
EXPECT: step=2, step2_teams_added=true, team_count=2

// TEST 5: Generar matches (liga 1 vuelta)
POST /tournaments/:id/auto-generate-matches
{
  "format": "league",
  "twoLegs": false
}
EXPECT: 200, matchesGenerated=1

// TEST 6: Generar matches (liga 2 vueltas)
POST /tournaments/:id/auto-generate-matches
{
  "format": "league",
  "twoLegs": true
}
EXPECT: 200, matchesGenerated=2

// TEST 7: Agregar más equipos
POST /tournaments/:id/add-teams
{
  "teamIds": ["team3", "team4", "team5", "team6", "team7", "team8"]
}
EXPECT: 200, teamsAdded=6 (total 8)

// TEST 8: Generar matches (copa)
POST /tournaments/:id/auto-generate-matches
{
  "format": "knockout"
}
EXPECT: 200, matchesGenerated=7

// TEST 9: Generar matches (híbrido)
POST /tournaments/:id/auto-generate-matches
{
  "format": "hybrid"
}
EXPECT: 200, matchesGenerated=15+ (grupos + knockout)

// TEST 10: Agendar matches en bulk
PATCH /matches/bulk-schedule
{
  "updates": [
    { "matchId": "match1", "matchDate": "2025-11-20", "matchTime": "14:00" },
    { "matchId": "match2", "matchDate": "2025-11-20", "matchTime": "16:00" }
  ]
}
EXPECT: 200, updated=2

// TEST 11: Verificar setup-status final
GET /tournaments/:id/setup-status
EXPECT: step=4, step4_matches_scheduled=true

// TEST 12: Validación - mínimo 2 equipos
POST /new-tournament/:id/auto-generate-matches
(con 1 equipo)
EXPECT: 400, "Se requiere mínimo 2 equipos"

// TEST 13: Validación - máximo 32 equipos
POST /new-tournament/:id/auto-generate-matches
(con 33 equipos)
EXPECT: 400, "No puede haber más de 32 equipos"

// TEST 14: GET /tournaments/:id con status
GET /tournaments/:id
EXPECT: status="inprogress" (después de generar matches)
```

**Herramientas de Testing:**

- Postman collection con los 14 tests
- O scripts de cURL
- O Jest/Supertest (si prefieres automatizado)

**Documentación:**

- Actualizar README.md con flow
- Incluir ejemplos de requests/responses
- Documentar en API docs

**Requisitos:**

- [x] 14 test cases cubriendo todo el flow
- [x] Testing para cada formato (league/knockout/hybrid)
- [x] Testing para validaciones (min/max equipos)
- [x] Testing para setup-status en cada paso
- [x] Testing para agendar matches en bulk

**Dependencias:** Todas las tareas 1-10

---

## 📝 RESUMEN POR TAREA

| #   | Tarea                | Archivos                                        | Estimado | Status |
| --- | -------------------- | ----------------------------------------------- | -------- | ------ |
| 1   | Add status field     | tournamentModel.js                              | 15 min   | ⏳     |
| 2   | Make fields optional | matchModel.js, schemas.js                       | 10 min   | ⏳     |
| 3   | POST /add-teams      | tournamentController/Service/Router, schemas.js | 30 min   | ⏳     |
| 4   | Algorithm: League    | tournamentService.js                            | 45 min   | ⏳     |
| 5   | Algorithm: Knockout  | tournamentService.js                            | 45 min   | ⏳     |
| 6   | Algorithm: Hybrid    | tournamentService.js                            | 60 min   | ⏳     |
| 7   | POST /auto-generate  | tournamentController/Service/Router, schemas.js | 30 min   | ⏳     |
| 8   | GET /setup-status    | tournamentController/Service/Router             | 25 min   | ⏳     |
| 9   | PATCH /bulk-schedule | matchController/Service/Router, schemas.js      | 25 min   | ⏳     |
| 10  | Validation: 2+ teams | tournamentService.js                            | 10 min   | ⏳     |
| 11  | Integration testing  | Postman/curl/Jest                               | 45 min   | ⏳     |

**Total Estimado: ~4.5 horas**

---

## ✅ CHECKLIST DE APROBACIÓN

Antes de empezar cada tarea:

- [ ] Tarea entendida y aprobada
- [ ] Dependencias completadas
- [ ] Testing plan claro
- [ ] Documentación clara

Después de completar cada tarea:

- [ ] Código escrito y funcional
- [ ] Testing completado
- [ ] Sin errores de validación
- [ ] Documentación actualizada

---

**¿Aprobas este plan? ¿Comenzamos con TASK 1?**
