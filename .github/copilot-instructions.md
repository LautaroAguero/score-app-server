# Score App Server - AI Coding Agent Instructions

## Architecture Overview

This is an **Express.js REST API** for managing sports tournaments, teams, and matches. Built with **ES Modules**, **MongoDB/Mongoose**, and follows a **modular service-oriented architecture**.

### Core Directory Structure

```
src/
├── api/v1/           # API version routing (aggregates all module routers)
├── config/           # App config, database, environment, file uploads
├── middlewares/      # Auth middleware (JWT-based)
├── modules/          # Feature modules (user, tournament, team)
│   └── [module]/
│       ├── [module]Model.js      # Mongoose schema
│       ├── [module]Service.js    # Business logic (class-based)
│       ├── [module]Controller.js # Request handlers
│       └── [module]Router.js     # Express routes
└── uploads/          # Static file storage (tournaments/, teams/)
```

## Critical Conventions

### Module Pattern (MUST FOLLOW)

Every feature module follows this exact 4-file pattern:

1. **Model** - Mongoose schema with timestamps, refs use `mongoose.Schema.Types.ObjectId`
2. **Service** - ES6 class with async methods, throws errors (not responses)
3. **Controller** - Exports named functions, calls service, handles req/res
4. **Router** - Express router, applies `auth` middleware, integrates with `src/api/v1/index.js`

**Example**: See `src/modules/tournament/` or `src/modules/team/`

### Authentication Pattern

- All protected routes use `auth` middleware from `src/middlewares/authentication.js`
- JWT token extracted from `Authorization: Bearer <token>` header
- Decoded user available as `req.user` (contains `id`, `email`)
- User ID automatically assigned to resources (e.g., `tournament.createdBy = req.user.id`)

### File Upload Pattern (Multer)

- Upload config in `src/config/upload.js` routes files by field name:
  - `tournamentBanner` → `uploads/tournaments/`
  - `teamLogo` → `uploads/teams/`
- Routes use `upload.single("fieldName")` middleware
- Controllers check `if (req.file)` and set path: `data.field = \`/uploads/folder/${req.file.filename}\``
- Files accessible at `http://localhost:4000/uploads/folder/filename.ext`

### Data Relationships

- **User** creates **Tournaments** (ref: `tournament.createdBy`)
- **Tournaments** contain **Teams** (ref: `team.tournament`)
- Use `.populate()` in services to include related data (e.g., `populate("tournament", "name sportType")`)

## Key Patterns & Decisions

### Service Layer Returns vs Throws

- Services **return data objects** on success
- Services **throw Error** with Spanish messages on failure (controller catches and sends JSON)
- Example: `throw new Error("Torneo no encontrado")` → controller sends 404

### Enum Fields

- `sportType`: `["soccer", "basketball", "volleyball", "tennis", "rugby"]`
- `tournamentFormat`: `["league", "knockout", "hybrid"]`
- `status`: `["upcoming", "inprogress", "finished"]` (default: `"upcoming"`)

### Default Values Pattern

- Points system: `pointsForWin: 3`, `pointsForDraw: 1`, `pointsForLoss: 0`
- Status: `status: "upcoming"` (auto-assigned on create)

### Route Organization

- Base API: `/api/v1/`
- Resource-specific routes come BEFORE parameterized routes:
  ```javascript
  router.get("/my-tournaments", auth, getMyTournaments); // BEFORE
  router.get("/:id", auth, getTournamentById); // AFTER
  ```

## Developer Workflows

### Start Server

```bash
npm start          # Production (node)
npm run dev        # Development (nodemon)
```

### Environment Variables Required

```
PORT=4000
DB_URI=mongodb://localhost:27017/score-app
JWT_SECRET=your_secret_key
```

### Adding a New Module

1. Create folder in `src/modules/[name]/`
2. Create Model → Service (class) → Controller (named exports) → Router
3. Import router in `src/api/v1/index.js`: `router.use("/resource", resourceRouter)`
4. If file uploads needed, add field name logic to `src/config/upload.js` destination function

### File Upload Setup

- Create directory: `uploads/[folder]/`
- Add `.gitignore` in folder (ignore all except `.gitignore`)
- Update `upload.js` destination logic for new field names

## Common Gotchas

- **ES Modules**: Use `.js` extensions in imports (`import X from "./file.js"`)
- **Spanish Error Messages**: Keep consistent with existing pattern
- **File Paths**: Controllers set relative paths `/uploads/...` (not absolute disk paths)
- **Helmet CORS**: Configured with `crossOriginResourcePolicy: { policy: "cross-origin" }` for image serving
- **Mongoose Population**: Always specify fields to populate (e.g., `"name email"`) to avoid over-fetching

## Testing Patterns

No test framework currently configured. Manual testing via Postman/similar tools with:

- Bearer token authentication
- Multipart form-data for file uploads
- JSON for non-file requests

## Current Modules

- **User**: Authentication (login/register), JWT tokens
- **Tournament**: Full CRUD, user-owned, supports banner uploads, status tracking
- **Team**: Full CRUD, tournament-scoped, supports logo uploads, optional grouping
- **Match**: Placeholder (not yet implemented)
