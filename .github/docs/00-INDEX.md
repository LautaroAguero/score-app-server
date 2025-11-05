# Score App Server - Documentation Index

Quick navigation for all project documentation. Start here.

## 📋 Core Documentation

| File                                                       | Purpose                                              | Read when...                                 |
| ---------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------- |
| **[01-API-DOCUMENTATION.md](./01-API-DOCUMENTATION.md)**   | All endpoints, methods, status codes                 | Building frontend, testing, adding endpoints |
| **[02-DEVELOPMENT-GUIDE.md](./02-DEVELOPMENT-GUIDE.md)**   | Architecture patterns, module structure, conventions | Creating new features, refactoring           |
| **[03-PROJECT-STATE.md](./03-PROJECT-STATE.md)**           | Completed modules, pending tasks, known issues       | Starting work, planning sprints              |
| **[04-COMMIT-CONVENTIONS.md](./04-COMMIT-CONVENTIONS.md)** | Git commit format, branch naming                     | Before each commit                           |
| **[05-CONTEXT-SNAPSHOT.md](./05-CONTEXT-SNAPSHOT.md)**     | Tech stack, key files, quick reference               | Project setup, context needed                |
| **[06-TASK-TEMPLATE.md](./06-TASK-TEMPLATE.md)**           | Standard task/issue format                           | Creating new tasks                           |
| **[07-VERIFIER-CHECKLIST.md](./07-VERIFIER-CHECKLIST.md)** | Pre-commit validation                                | Before pushing code                          |

---

## 🚀 Quick Start Workflow

### 1. **Starting a Task**

```
1. Read: 03-PROJECT-STATE.md (2 min) - What's done?
2. Read: 05-CONTEXT-SNAPSHOT.md (1 min) - Tech stack reminder
3. Read: 02-DEVELOPMENT-GUIDE.md (as needed) - Patterns
4. Start coding following [02-DEVELOPMENT-GUIDE.md](./02-DEVELOPMENT-GUIDE.md)
```

### 2. **During Implementation**

- Reference [01-API-DOCUMENTATION.md](./01-API-DOCUMENTATION.md) for endpoint patterns
- Follow [02-DEVELOPMENT-GUIDE.md](./02-DEVELOPMENT-GUIDE.md) conventions
- Check [07-VERIFIER-CHECKLIST.md](./07-VERIFIER-CHECKLIST.md) progress

### 3. **Before Commit**

```
1. Run: 07-VERIFIER-CHECKLIST.md checks
2. Write commit message using: 04-COMMIT-CONVENTIONS.md
3. Push
```

---

## 📚 File Organization

```
.github/
├── docs/
│   ├── 00-INDEX.md (you are here)
│   ├── 01-API-DOCUMENTATION.md
│   ├── 02-DEVELOPMENT-GUIDE.md
│   ├── 03-PROJECT-STATE.md
│   ├── 04-COMMIT-CONVENTIONS.md
│   ├── 05-CONTEXT-SNAPSHOT.md
│   ├── 06-TASK-TEMPLATE.md
│   └── 07-VERIFIER-CHECKLIST.md
└── copilot-instructions.md (legacy - being phased out)
```

---

## 🔄 How AI Agent Uses This

1. **Task starts** → Load `03-PROJECT-STATE.md` + `05-CONTEXT-SNAPSHOT.md`
2. **Need patterns?** → Consult `02-DEVELOPMENT-GUIDE.md`
3. **Building endpoint?** → Reference `01-API-DOCUMENTATION.md`
4. **Before commit** → Execute `07-VERIFIER-CHECKLIST.md`
5. **Commit message** → Follow `04-COMMIT-CONVENTIONS.md`

---

## 📝 Key Points

- All docs stay **under 2000 words** (quick to scan)
- Updates are **granular** (change only what's needed)
- References are **cross-linked** between docs
- Checklists are **executable** (yes/no or command format)

---

Last updated: November 4, 2025
