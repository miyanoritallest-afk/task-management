# CLAUDE.md — Task Management App: Claude Code Rules

## Project Overview
Spring Boot 4 (Java 21, Gradle) backend + React 18 (Vite) frontend.
Kanban board app. See `docs/` for requirements and architecture.

## Mandatory Workflow — Follow Without Exception

### 1. GitHub Issue First
Before writing ANY code or creating ANY branch:
- Check if a GitHub Issue exists: `gh issue list`
- If no issue exists, create one FIRST: `gh issue create --title "..." --body "..." --label "..."`
- Record the issue number. All subsequent steps reference it.

### 2. Branch Naming
Branches MUST follow this pattern: `<type>/issue-<number>-<short-slug>`

| Prefix | Use for |
|--------|---------|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `chore/` | Tooling, deps, CI, config |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring, no behavior change |
| `test/` | Adding or fixing tests |

Examples:
- `feature/issue-12-card-drag-drop`
- `fix/issue-7-column-sort-crash`
- `docs/issue-3-api-reference`

Create branch: `git checkout -b <type>/issue-<N>-<slug>`

### 3. No Direct Push to Main
NEVER run `git push origin main` or commit directly to main.
Main is protected. All changes go through Pull Requests.

### 4. Commit Messages
Format: `<type>(<scope>): <short description> (#<issue-number>)`

Examples:
- `feat(backend): add Card priority field (#5)`
- `fix(frontend): correct column sort order (#8)`
- `chore(docker): add healthcheck to postgres service (#2)`

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`

### 5. Pull Request Process
1. Push branch: `git push -u origin <branch-name>`
2. Create PR: `gh pr create --fill`
3. PR title format: `<type>: <description> (#<issue-number>)`
4. Ensure PR body contains `Closes #<N>`
5. After merge, delete branch: `git branch -d <branch-name>`

## Local Development Commands
```bash
# Start PostgreSQL
docker compose up -d

# Backend (from backend/)
./gradlew bootRun

# Frontend (from frontend/ — when created)
npm run dev
```

## Key Paths
- Backend source: `backend/src/main/java/com/taskmanagement/backend/`
- DB migrations: `backend/src/main/resources/db/migration/`
- Requirements docs: `docs/`
- Docker config: `docker-compose.yml`, `backend/Dockerfile`
