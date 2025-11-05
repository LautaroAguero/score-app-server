# Commit Conventions

Standardized commit message format and branch naming for consistency and clarity.

---

## 📝 Commit Message Format

Use this format for all commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of:

- **feat** - New feature
- **fix** - Bug fix
- **refactor** - Code restructuring (no functionality change)
- **docs** - Documentation changes
- **test** - Adding/updating tests
- **chore** - Build, dependencies, tooling (no code changes)
- **perf** - Performance improvement
- **style** - Formatting, missing semicolons (no logic change)

### Scope

Optional but recommended. The module or area affected:

- `user`
- `tournament`
- `team`
- `match`
- `auth`
- `upload`
- `api`
- `config`
- `docs`

### Subject

- Use **imperative mood** ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Max 50 characters

### Body

Optional. Explain **what** and **why**, not **how**.

```
- Explain the problem being solved
- Mention breaking changes
- Reference related issues (#123)
```

### Footer

Optional. Use for:

- Issue references: `Closes #123`
- Breaking changes: `BREAKING CHANGE: ...`

---

## ✅ Commit Examples

### Simple Feature

```
feat(tournament): add standings calculation endpoint

GET /tournaments/:id/standings now returns team standings based on completed matches
```

### Bug Fix

```
fix(team): fix tournament filter not working in get teams query

Query parameter ?tournament=id was being ignored due to missing filter logic
Closes #42
```

### Refactoring

```
refactor(tournament): extract standings logic to service method

Move standings calculation from controller to service layer for better testability
```

### Documentation

```
docs: add development guide and module structure documentation

Create modular documentation structure:
- 01-API-DOCUMENTATION.md
- 02-DEVELOPMENT-GUIDE.md
- 03-PROJECT-STATE.md
- And 4 more...

This replaces the monolithic copilot-instructions.md
```

### Chore

```
chore: update package.json dependencies

Update nodemon to v3.0.1 for better performance
```

---

## 🌿 Branch Naming

Format: `<type>/<scope>-<description>`

### Types

- `feature/` - New feature
- `fix/` - Bug fix
- `refactor/` - Code restructuring
- `docs/` - Documentation
- `chore/` - Tooling, dependencies

### Examples

```
feature/tournament-standings
fix/auth-token-expiry
refactor/match-service
docs/api-documentation
chore/update-dependencies
```

---

## 🔄 Workflow

1. **Create branch:**

   ```bash
   git checkout -b feature/tournament-standings
   ```

2. **Make commits** (as you work, not one mega commit):

   ```bash
   git commit -m "feat(tournament): add standings calculation"
   git commit -m "feat(tournament): add standings controller"
   git commit -m "feat(tournament): add standings route"
   ```

3. **Before push**, verify with verifier checklist: `07-VERIFIER-CHECKLIST.md`

4. **Push:**

   ```bash
   git push origin feature/tournament-standings
   ```

5. **Create pull request** with commit summary in description

---

## 📌 Common Mistakes to Avoid

❌ `git commit -m "fix stuff"`  
✅ `git commit -m "fix(match): prevent duplicate score updates"`

❌ `git commit -m "updates"`  
✅ `git commit -m "feat(tournament): add standings endpoint"`

❌ `git commit -m "FIXED THE BUG"`  
✅ `git commit -m "fix(auth): resolve token validation error"`

❌ Commits without scope  
✅ Commits with clear scope

---

## 🔗 Atomic Commits

Each commit should be:

- **Self-contained** - Works independently
- **Focused** - One logical change
- **Reversible** - Can be reverted without breaking others

**Good:**

```
feat(tournament): add standings calculation ✓ (one feature)
feat(tournament): add standings route ✓ (one route)
feat(tournament): add standings controller ✓ (one handler)
```

**Bad:**

```
feat: add standings, fix team filter, update docs ✗ (too many changes)
```

---

## 📊 Commit History Example

```
* abc1234 - feat(tournament): add standings endpoint (1 min ago)
* def5678 - feat(tournament): add standings controller (5 min ago)
* ghi9012 - feat(tournament): add standings service method (10 min ago)
* jkl3456 - Merge branch 'main' (2 hours ago)
* mno7890 - fix(match): validate teams belong to same tournament (1 day ago)
* pqr1234 - feat(team): add logo upload support (2 days ago)
```

---

## 🚫 Revert a Commit

If you need to undo a commit:

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1

# Create a revert commit (better for pushed commits)
git revert abc1234
```

Then commit the revert with:

```
chore: revert feat(tournament) - incorrect standings logic
```

---

## ✅ Pre-Commit Checklist

Before `git commit`:

- [ ] Code follows development guide patterns
- [ ] All 4 files updated if adding new module (Model/Service/Controller/Router)
- [ ] Error messages are in Spanish
- [ ] File paths are relative (`/uploads/...` not `C:\...`)
- [ ] No console.log statements (only console.error for debugging)
- [ ] No hardcoded values
- [ ] Tests pass (if applicable)

See `07-VERIFIER-CHECKLIST.md` for full pre-push validation

---

Last updated: November 4, 2025
