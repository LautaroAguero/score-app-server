# Task Template

Use this format when creating new tasks, issues, or feature requests.

---

## 📋 Task Example

```
Title: [Feature/Bug/Refactor] Brief description

**Type:** Feature | Bug | Refactor | Documentation

**Priority:** High | Medium | Low

**Description**

Clear explanation of what needs to be done and why.

Include:
- Problem statement
- User story (if feature): "As a [user], I want to [action] so that [benefit]"
- Expected behavior
- Context/background

**Acceptance Criteria**

- [ ] Specific, testable requirement 1
- [ ] Specific, testable requirement 2
- [ ] Follows [02-DEVELOPMENT-GUIDE.md](./02-DEVELOPMENT-GUIDE.md) patterns
- [ ] Error messages in Spanish
- [ ] Documentation updated

**Technical Details**

If applicable:
- Module(s) affected: user, tournament, team, etc.
- Files to modify: src/modules/...
- New files needed: yes/no
- Database schema changes: yes/no
- Breaking changes: yes/no

**Related Issues/PRs**

- Closes: #123 (if fixing an issue)
- Related to: #456 (if connected to other work)

**Implementation Notes**

Optional tips or considerations:
- Watch out for X
- Remember to Y
- Consider Z for future

**Assigned to:** @username
**Estimated effort:** 1-2 hours | 3-5 hours | 5+ hours
**Labels:** enhancement, bug, documentation
```

---

## 🎯 Task Variations

### Feature Task

```
Title: Add player management to teams

**Type:** Feature
**Priority:** High

**Description**
Teams need individual player tracking for match statistics. Currently, only team-level
scores are tracked.

**User Story**
As a tournament organizer, I want to add players to teams so that I can track individual
player statistics in matches.

**Acceptance Criteria**
- [ ] Create Player model with fields: name, team, position, number
- [ ] Add POST /teams/:id/players (protected)
- [ ] Add GET /teams/:id/players (public)
- [ ] Update match stats to include player-level data
- [ ] Follow 4-file module pattern from [02-DEVELOPMENT-GUIDE.md](./02-DEVELOPMENT-GUIDE.md)

**Technical Details**
- Module: player (new)
- Files: Create src/modules/player/*
- Schema changes: Add Player collection, reference in Match
- No breaking changes
```

### Bug Task

```
Title: Fix tournament filter not working in teams endpoint

**Type:** Bug
**Priority:** High

**Description**
When fetching teams with ?tournament=id query parameter, the filter is ignored
and all teams are returned regardless of tournament ID.

**Expected Behavior**
GET /teams?tournament=507f1f77bcf86cd799439011 should only return teams in that tournament

**Current Behavior**
Returns all teams in database, ignoring query parameter

**Acceptance Criteria**
- [ ] Query parameter filtering works correctly
- [ ] Tested with multiple tournament IDs
- [ ] Tested with invalid tournament ID (returns empty array)
- [ ] No regression in other team endpoints

**Technical Details**
- File: src/modules/team/teamService.js (likely)
- Root cause: Missing filter logic in getAllTeams method
- No database changes needed
```

### Refactor Task

```
Title: Extract standings calculation to utils

**Type:** Refactor
**Priority:** Low

**Description**
Standings calculation logic is currently in tournamentService.getTournamentStandings().
This logic should be extracted to a utility function for reusability and testability.

**Acceptance Criteria**
- [ ] Create src/core/utils/standingsCalculator.js
- [ ] Move calculation logic to utility function
- [ ] Service calls utility function
- [ ] All tests pass
- [ ] No functional changes (same output)
- [ ] Add JSDoc comments

**Technical Details**
- Files:
  - Create: src/core/utils/standingsCalculator.js
  - Modify: src/modules/tournament/tournamentService.js
- No breaking changes
```

### Documentation Task

```
Title: Document tournament standings API response format

**Type:** Documentation
**Priority:** Medium

**Description**
The standings endpoint was recently added but lacks detailed documentation of the
response structure and usage examples.

**Acceptance Criteria**
- [ ] Add endpoint to 01-API-DOCUMENTATION.md
- [ ] Include request/response examples
- [ ] Document sorting logic (points → goal diff → goals for)
- [ ] Include example cURL commands
- [ ] Document edge cases (no matches, no teams)
```

---

## 📝 Filling Out Your Task

### Before Starting

1. Copy this template
2. Fill in all required fields (marked with `*`)
3. Be as specific as possible
4. Link to relevant docs

### Acceptance Criteria Guidelines

- **Testable** - Can someone verify it's done?
- **Specific** - "Add error handling" is vague; "Add error handling for invalid tournament IDs" is specific
- **Complete** - Include related work (tests, docs, etc.)
- **Always include:** "Follows development patterns" + "Error messages in Spanish" (if applicable)

### Technical Details Guidelines

- **Module affected** - Which existing modules are impacted?
- **Files to modify** - List specific files
- **New files** - Are you creating new modules?
- **Database** - Any schema changes?
- **Breaking changes** - Will this require frontend updates?

### Estimated Effort

- **1-2 hours** - Small changes, well-defined scope, single file
- **3-5 hours** - Medium feature, multiple files, requires some design
- **5+ hours** - Complex feature, multiple modules, significant design work

---

## ✅ Task Completion Checklist

When task is complete:

- [ ] All acceptance criteria met
- [ ] Code follows [02-DEVELOPMENT-GUIDE.md](./02-DEVELOPMENT-GUIDE.md) patterns
- [ ] Tested manually (if possible)
- [ ] Related documentation updated
- [ ] Commit message follows [04-COMMIT-CONVENTIONS.md](./04-COMMIT-CONVENTIONS.md)
- [ ] Passed [07-VERIFIER-CHECKLIST.md](./07-VERIFIER-CHECKLIST.md)
- [ ] Pushed to branch
- [ ] Pull request created

---

## 🔗 Task Workflow

1. **Create task** using this template
2. **Assign to team member** (or self)
3. **Move to In Progress** when starting
4. **Refer to docs** during implementation:
   - [02-DEVELOPMENT-GUIDE.md](./02-DEVELOPMENT-GUIDE.md) for patterns
   - [01-API-DOCUMENTATION.md](./01-API-DOCUMENTATION.md) for endpoints
5. **Complete acceptance criteria**
6. **Run verifier checklist:** [07-VERIFIER-CHECKLIST.md](./07-VERIFIER-CHECKLIST.md)
7. **Commit** following [04-COMMIT-CONVENTIONS.md](./04-COMMIT-CONVENTIONS.md)
8. **Create pull request**
9. **Mark as Done**

---

## 💡 Pro Tips

- **Break down large tasks** - 5+ hour tasks should be split
- **Write clear descriptions** - Future you will thank you
- **Link related work** - "Related to #456"
- **Include context** - Why is this needed?
- **Be specific with criteria** - Vague criteria = unclear when done
- **Update PROJECT-STATE.md** - When task is complete, update the state doc

---

Last updated: November 4, 2025
