# Verifier Checklist

Pre-commit validation checklist. Run this before pushing any code.

---

## ✅ Pre-Commit Checks (Run before `git commit`)

### Code Quality

- [ ] **No console.log statements** (only console.error for debugging)

  ```bash
  grep -r "console.log" src/
  # Should return 0 results
  ```

- [ ] **No hardcoded values** (use env vars or config)

  ```bash
  grep -r "const.*=.*[0-9]\{1,3\}\." src/  # URLs/IPs
  # Review results for hardcoded values
  ```

- [ ] **No TODO comments without context**

  ```bash
  grep -r "TODO\|FIXME\|HACK" src/
  # Should either be removed or have issue reference: TODO: #123
  ```

- [ ] **Imports use .js extensions** (ES Modules requirement)
  ```bash
  grep -r 'import.*from "[^"]*"$' src/ | grep -v ".js"
  # Should return 0 results
  ```

### File Organization

- [ ] **New module has all 4 files** (if creating new feature):

  - [ ] `[name]Model.js` exists with schema
  - [ ] `[name]Service.js` exists with class and async methods
  - [ ] `[name]Controller.js` exists with named exports
  - [ ] `[name]Router.js` exists with routes

- [ ] **New module registered** in `src/api/v1/index.js`:

  ```javascript
  import newRouter from "../modules/new/newRouter.js";
  router.use("/new", newRouter);
  ```

- [ ] **Route order is correct** (specific before parameterized):

  ```javascript
  router.get("/my-resources", ...);    // ✓ Before
  router.get("/:id", ...);              // ✓ After
  // NOT: router.get("/:id", ...); router.get("/my-resources", ...);
  ```

- [ ] **No duplicate routes** in router
  ```bash
  grep "router\." src/modules/*/\*Router.js | sort | uniq -d
  # Should return 0 results
  ```

### Error Handling

- [ ] **All error messages in Spanish** (consistent with codebase)

  ```bash
  grep -r "throw new Error" src/ | grep -v Spanish
  # Verify all messages are in Spanish
  ```

- [ ] **Services throw errors** (not send HTTP responses)

  ```bash
  grep -r "res.status\|res.json" src/modules/\*/\*Service.js
  # Should return 0 results (controllers handle responses)
  ```

- [ ] **Controllers catch errors and send responses**
  ```bash
  grep -r "try.*catch" src/modules/\*/\*Controller.js
  # Every handler should have try/catch
  ```

### File Uploads

- [ ] **File paths are relative** (not absolute disk paths)

  ```bash
  grep -r "uploads" src/ | grep -v "^/uploads"
  # Should use /uploads/... format
  ```

- [ ] **Upload directory exists** (if adding new file type):

  ```bash
  ls -la uploads/[folder]/
  # Should exist and have .gitignore
  ```

- [ ] **Upload routes use correct field names**
  ```javascript
  // In controller: req.file.fieldname should match config
  upload.single("tournamentBanner"); // Matches upload.js config
  ```

### Database & Schema

- [ ] **ObjectId references correct** (Mongoose format)

  ```javascript
  // ✓ Correct
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  // ✗ Wrong
  createdBy: {
    type: String,
    ref: "User"
  }
  ```

- [ ] **Timestamps included** in new schemas

  ```javascript
  const schema = new mongoose.Schema(
    {
      /* fields */
    },
    { timestamps: true } // ✓ Must be included
  );
  ```

- [ ] **Enum values are consistent** (use defined constants):
  ```javascript
  // From 05-CONTEXT-SNAPSHOT.md
  sportType: ["soccer", "basketball", "volleyball", "tennis", "rugby"];
  tournamentFormat: ["league", "knockout", "hybrid"];
  status: ["upcoming", "inprogress", "finished"];
  matchStatus: ["scheduled", "playing", "completed"];
  ```

### API & Routes

- [ ] **Protected routes have auth middleware**

  ```javascript
  // POST, PUT, DELETE should have auth
  router.post("/", auth, createTournament); // ✓
  router.delete("/:id", auth, deleteTournament); // ✓

  // GET can be public
  router.get("/", getAllTournaments); // ✓
  ```

- [ ] **Public GET routes accessible without token**

  ```bash
  curl http://localhost:4000/api/v1/tournaments
  # Should return 200 OK without Authorization header
  ```

- [ ] **Protected endpoints require token**
  ```bash
  curl -X POST http://localhost:4000/api/v1/tournaments
  # Should return 401 Unauthorized without token
  ```

---

## ✅ Pre-Push Checks (Run before `git push`)

### Testing

- [ ] **Manual test conducted** (if UI/API changes):

  - [ ] Test happy path (success case)
  - [ ] Test error cases (invalid input, missing data)
  - [ ] Test edge cases (empty results, large datasets)

- [ ] **File upload works** (if upload feature)

  ```bash
  # Use Postman/curl to test
  curl -F "tournamentBanner=@file.jpg" http://localhost:4000/api/v1/tournaments
  # Should return 201 with image path
  ```

- [ ] **Query parameters work** (if filters added)
  ```bash
  curl "http://localhost:4000/api/v1/teams?tournament=507f1f77bcf86cd799439011"
  # Should only return teams in that tournament
  ```

### Git & Commits

- [ ] **Commit message follows format** (See 04-COMMIT-CONVENTIONS.md)

  ```
  Type: feat|fix|refactor|docs|test|chore|perf|style
  Scope: (module name)
  Subject: Imperative mood, no period, <50 chars
  ```

- [ ] **No unrelated changes** in commit

  ```bash
  git diff HEAD~1
  # Should only show intended changes
  ```

- [ ] **All files staged correctly**

  ```bash
  git status
  # Only intended files in staging area
  ```

- [ ] **Branch name follows convention** (See 04-COMMIT-CONVENTIONS.md)
  ```
  feature/tournament-standings
  fix/auth-token-expiry
  refactor/match-service
  ```

### Code Review

- [ ] **Self-review completed**

  ```bash
  git diff main
  # Review all changes line-by-line
  ```

- [ ] **Logic is correct**

  - [ ] Algorithm produces expected output
  - [ ] Edge cases handled
  - [ ] Performance acceptable

- [ ] **No security issues**
  - [ ] No hardcoded secrets
  - [ ] Proper auth checks
  - [ ] Input validation present
  - [ ] No SQL injection risks (using Mongoose)

### Documentation

- [ ] **Comments explain WHY not WHAT**

  ```javascript
  // ✓ Good
  // Calculate standings based on completed matches to avoid incomplete data
  const matches = await Match.find({ status: "completed" });

  // ✗ Bad
  // Get completed matches
  const matches = await Match.find({ status: "completed" });
  ```

- [ ] **Relevant .md docs updated**:

  - [ ] `03-PROJECT-STATE.md` (if feature complete)
  - [ ] `01-API-DOCUMENTATION.md` (if new endpoint)
  - [ ] `02-DEVELOPMENT-GUIDE.md` (if new pattern)
  - [ ] README.md (if setup changes)

- [ ] **Complex logic has JSDoc**
  ```javascript
  /**
   * Calculate tournament standings based on completed matches
   * @param {string} tournamentId - Tournament ID
   * @returns {Object} Standings with teams sorted by points
   */
  async getTournamentStandings(tournamentId) {
    // ...
  }
  ```

---

## ✅ Testing Checklist (If applicable)

### Unit Tests

- [ ] Tests follow existing test patterns
- [ ] 80%+ code coverage for service methods
- [ ] Tests pass: `npm test`

### Integration Tests

- [ ] All routes tested with requests
- [ ] Auth tests included
- [ ] Error cases tested

### Manual Testing

- [ ] Tested in Postman/curl
- [ ] Tested in frontend (if integrated)
- [ ] No console errors

---

## 🚀 Final Pre-Push Workflow

```bash
# 1. Run code quality checks
npm run lint  # If configured

# 2. Run tests (if configured)
npm test

# 3. Check git status
git status

# 4. Review changes
git diff

# 5. Review specific files
git show HEAD~1:src/modules/tournament/tournamentRouter.js

# 6. Verify server runs
npm run dev
# Test endpoint manually in browser/Postman

# 7. Make sure you're on correct branch
git branch

# 8. Verify commit is correct
git log --oneline -5

# 9. Push
git push origin feature/your-feature

# 10. Create PR with reference to task
```

---

## ❌ Common Failure Scenarios

| Scenario                         | Check                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------- |
| "Route not found (404)"          | Is it registered in `/api/v1/index.js`? Route order?                         |
| "Cast to ObjectId failed"        | Using `/:id` before `/my-resources`?                                         |
| "Unexpected field"               | File upload field name matches `upload.js`?                                  |
| "Torneo no encontrado (Spanish)" | Is this in controller catch? Services should throw it                        |
| "Cannot find module"             | Missing `.js` extension?                                                     |
| "auth is not defined"            | Import missing? `import { auth } from "../../middlewares/authentication.js"` |
| "Multer error"                   | File size > 5MB? Wrong file type?                                            |

---

## 📊 Verification Summary

Before you push, verify:

✅ Code quality (no logs, imports correct)  
✅ File organization (4-file pattern if new module)  
✅ Routes registered and ordered correctly  
✅ Error handling (Spanish messages, proper status codes)  
✅ Database schema (ObjectId, timestamps, enums)  
✅ Files tested (manual test conducted)  
✅ Documentation updated  
✅ Commit follows convention  
✅ No unrelated changes

**If all boxes checked → Safe to push! 🚀**

---

## 🆘 Need Help?

- Route issue? → Check `02-DEVELOPMENT-GUIDE.md` Route Integration section
- API issue? → Check `01-API-DOCUMENTATION.md` for expected response format
- Module structure? → Check `02-DEVELOPMENT-GUIDE.md` Module Architecture section
- Commit format? → Check `04-COMMIT-CONVENTIONS.md`

---

Last updated: November 4, 2025
