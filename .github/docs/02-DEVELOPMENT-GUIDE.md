# Development Guide

Architecture patterns, conventions, and HOW-TOs. Reference this when building new features.

---

## 🏗️ Module Architecture

Every feature module follows the **4-file pattern**:

```
src/modules/[feature]/
├── [feature]Model.js       # Mongoose schema
├── [feature]Service.js     # Business logic (class-based)
├── [feature]Controller.js  # Request handlers
└── [feature]Router.js      # Express routes
```

### 1. Model - Define Schema

**File:** `src/modules/[feature]/[feature]Model.js`

```javascript
import mongoose from "mongoose";

const [feature]Schema = new mongoose.Schema(
  {
    // Fields with types
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "inprogress", "finished"],
      default: "upcoming",
    },
    // Timestamps auto-added
  },
  { timestamps: true }
);

const [Feature] = mongoose.model("[Feature]", [feature]Schema);
export default [Feature];
```

**Key patterns:**

- Always use `mongoose.Schema.Types.ObjectId` for references
- Use `enum` for controlled values (sportType, status, etc.)
- Always include `{ timestamps: true }` for createdAt/updatedAt
- Default values with `default:` field

### 2. Service - Business Logic

**File:** `src/modules/[feature]/[feature]Service.js`

```javascript
import [Feature] from "./[feature]Model.js";

export class [Feature]Service {
  // Always async methods
  async create[Feature](data) {
    try {
      const [feature] = new [Feature](data);
      return await [feature].save();
    } catch (err) {
      // Services THROW errors with Spanish messages
      throw new Error("Error al crear [feature]");
    }
  }

  async get[Feature]ById(id) {
    const [feature] = await [Feature].findById(id).populate(
      "createdBy",
      "name email"
    );
    if (!room) throw new Error("[Feature] no encontrado");
    return [feature];
  }

  async update[Feature](id, data) {
    const [feature] = await [Feature].findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!room) throw new Error("[Feature] no encontrado");
    return [feature];
  }

  async delete[Feature](id) {
    const [feature] = await [Feature].findByIdAndDelete(id);
    if (!room) throw new Error("[Feature] no encontrado");
    return { message: "[Feature] eliminado exitosamente" };
  }
}
```

**Key patterns:**

- All methods are `async`
- Services **return data** on success
- Services **throw Error** on failure (not HTTP responses)
- Error messages in **Spanish**
- Use `.populate()` to include related data with specific fields

### 3. Controller - Request Handlers

**File:** `src/modules/[feature]/[feature]Controller.js`

```javascript
import { [Feature]Service } from "./[feature]Service.js";

const [feature]Service = new [Feature]Service();

export const create[Feature] = async (req, res) => {
  try {
    const data = { ...req.body };

    // Auto-assign user if creating own resource
    data.createdBy = req.user.id;

    // Handle file upload if applicable
    if (req.file) {
      data.[feature]Banner = `/uploads/[features]/${req.file.filename}`;
    }

    const [feature] = await [feature]Service.create[Feature](data);
    res.status(201).json({ [feature] });
  } catch (err) {
    // Controllers catch and return HTTP response
    res.status(400).json({ message: err.message });
  }
};

export const get[Feature]ById = async (req, res) => {
  try {
    const [feature] = await [feature]Service.get[Feature]ById(
      req.params.id
    );
    res.status(200).json({ [feature] });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update, Delete, Get All follow same pattern
```

**Key patterns:**

- All are named `export const`
- Wrap in try/catch
- Call service methods
- Controllers handle HTTP responses
- `req.user` available after auth middleware (contains `id`, `email`)

### 4. Router - Express Routes

**File:** `src/modules/[feature]/[feature]Router.js`

```javascript
import express from "express";
import {
  create[Feature],
  get[Feature]ById,
  update[Feature],
  delete[Feature],
  get[Features], // plural
} from "./[feature]Controller.js";
import { auth } from "../../middlewares/authentication.js";
import { upload } from "../../config/upload.js";

const router = express.Router();

// ⚠️ IMPORTANT: Public routes BEFORE parameterized routes
router.get("/", get[Features]); // Public - list all
router.get("/my-[features]", auth, getMyFeatures); // Protected - specific route

// Then parameterized routes
router.post("/", auth, upload.single("[feature]Banner"), create[Feature]);
router.get("/:id", get[Feature]ById); // Public
router.put("/:id", auth, upload.single("[feature]Banner"), update[Feature]);
router.delete("/:id", auth, delete[Feature]);

export default router;
```

**Key patterns:**

- **Route order matters**: Specific routes BEFORE `/:id`
- Public GET routes have ❌ auth
- Create/Update/Delete have ✅ auth
- File uploads use `upload.single("fieldName")`
- Import auth middleware only for protected routes

---

## 🔐 Authentication Flow

All protected endpoints use JWT Bearer token authentication:

```javascript
// middleware/authentication.js
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { id: decoded.id, email: decoded.email };
  next();
};
```

**Using in controllers:**

```javascript
// After auth middleware, access user info
export const create[Feature] = async (req, res) => {
  const data = { ...req.body };
  data.createdBy = req.user.id; // Auto-assign current user
  // ...
};
```

---

## 📁 File Upload Pattern

**Config:** `src/config/upload.js`

```javascript
const destination = (req, file, cb) => {
  if (file.fieldname === "tournamentBanner") {
    cb(null, "uploads/tournaments");
  } else if (file.fieldname === "teamLogo") {
    cb(null, "uploads/teams");
  }
};
```

**In controller:**

```javascript
if (req.file) {
  data.tournamentBanner = `/uploads/tournaments/${req.file.filename}`;
}
```

**Add new file type:**

1. Add field logic in `upload.js` destination function
2. Create directory: `uploads/[folder]/`
3. Add `.gitignore` in folder (ignore all except `.gitignore`)
4. In controller, set path: `/uploads/[folder]/${req.file.filename}`

---

## 📊 Enum Fields (Controlled Values)

Keep these consistent across codebase:

| Field                 | Values                                                  |
| --------------------- | ------------------------------------------------------- |
| `sportType`           | `soccer`, `basketball`, `volleyball`, `tennis`, `rugby` |
| `tournamentFormat`    | `league`, `knockout`, `hybrid`                          |
| `status` (tournament) | `upcoming`, `inprogress`, `finished`                    |
| `matchStatus`         | `scheduled`, `playing`, `completed`                     |

---

## 🔗 Data Relationships

```
User
  ↓ creates
Tournament (createdBy: User)
  ↓ contains
Team (tournament: Tournament)
  ↓ plays in
Match (tournament: Tournament, homeTeam: Team, awayTeam: Team)
```

**Populate pattern:**

```javascript
// In Service
const tournament = await Tournament.findById(id)
  .populate("createdBy", "name email")
  .populate({
    path: "teams",
    select: "name teamLogo",
  });
```

---

## 📝 Error Handling Pattern

**Services throw:**

```javascript
throw new Error("Torneo no encontrado");
```

**Controllers catch & respond:**

```javascript
catch (err) {
  res.status(404).json({ message: err.message });
}
```

**Spanish error messages are CONSISTENT** - team uses same messages across codebase

---

## 🚀 Route Integration

Add new module routes to `src/api/v1/index.js`:

```javascript
import tournamentRouter from "../modules/tournament/tournamentRouter.js";
import teamRouter from "../modules/team/teamRouter.js";
import matchRouter from "../modules/match/matchRouter.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/tournaments", tournamentRouter);
router.use("/teams", teamRouter);
router.use("/matches", matchRouter);

export default router;
```

---

## ✅ Default Values Pattern

Always set sensible defaults:

```javascript
{
  pointsForWin: 3,
  pointsForDraw: 1,
  pointsForLoss: 0,
  status: "upcoming",
  homeTeamScore: 0,
  awayTeamScore: 0,
}
```

---

## 🎯 Common Gotchas

1. **ES Modules** - Always use `.js` extensions: `import X from "./file.js"`
2. **Route order** - Specific routes BEFORE `/:id` or they won't be reached
3. **Timestamps** - Always include `{ timestamps: true }` in schema
4. **References** - Use `mongoose.Schema.Types.ObjectId` (not just `String`)
5. **File paths** - Use relative paths `/uploads/...` not absolute disk paths
6. **Spanish messages** - Keep consistent with existing patterns
7. **Populate specificity** - Always specify fields: `.populate("user", "name email")` not just `.populate("user")`

---

## 📋 AI Agent Directive

**IMPORTANT:** Do NOT create new documentation files unless explicitly requested by user. All documentation must go into existing .md files only:

- New features → Update `03-PROJECT-STATE.md`
- New patterns → Update `02-DEVELOPMENT-GUIDE.md`
- New endpoints → Update `01-API-DOCUMENTATION.md`
- New checklist items → Update `07-VERIFIER-CHECKLIST.md`

---

Last updated: November 4, 2025
