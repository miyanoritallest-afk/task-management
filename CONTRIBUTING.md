# Contributing Guide

This is a solo learning project. These rules exist to build good habits and keep the git history clean.

## The Golden Rules

1. **Issue first, code second.** Every piece of work begins with a GitHub Issue.
2. **No direct commits to `main`.** Ever. Use a branch and a PR.
3. **One issue, one branch, one PR.** Keep scope tight.

## Step-by-Step Workflow

### Step 1: Create or find an Issue

```bash
# List open issues
gh issue list

# Create a new issue
gh issue create --title "feat: add card due date display" --label "enhancement"
```

Note the issue number (e.g., `#12`).

### Step 2: Create a branch

Branch naming: `<type>/issue-<number>-<slug>`

```bash
git checkout main
git pull origin main
git checkout -b feature/issue-12-card-due-date
```

| Prefix | When to use |
|--------|-------------|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `chore/` | Build, deps, infra, config |
| `docs/` | Documentation |
| `refactor/` | Restructuring, no behavior change |
| `test/` | Test additions only |

### Step 3: Write code and commit

Commit format: `<type>(<scope>): <description> (#<issue-number>)`

```bash
git add backend/src/...
git commit -m "feat(backend): add dueDate field to Card entity (#12)"
```

### Step 4: Push and open a PR

```bash
git push -u origin feature/issue-12-card-due-date
gh pr create --fill
```

Fill in the PR template. The `Closes #12` line in the body automatically closes the issue when the PR merges.

### Step 5: Merge and clean up

```bash
# After merge on GitHub:
git checkout main
git pull origin main
git branch -d feature/issue-12-card-due-date
```

## Commit Message Types

| Type | Purpose |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Tooling, deps, CI |
| `docs` | Documentation |
| `refactor` | Restructuring |
| `test` | Test-only changes |
| `style` | Formatting, whitespace |

## Labels

| Label | Meaning |
|-------|---------|
| `bug` | Something is broken |
| `enhancement` | New feature or improvement |
| `chore` | Infrastructure, tooling |
| `docs` | Documentation |
| `phase-1` through `phase-4` | Development phase tag |

## Local Development

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Start backend (from backend/)
./gradlew bootRun

# 3. Start frontend (from frontend/ — Phase 1+)
npm run dev
```

- Backend API: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432`, database `kanban_db`
