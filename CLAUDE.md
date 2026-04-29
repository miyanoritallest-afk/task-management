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

## Port Assignment — Fixed, Never Change

| Service    | Port | Config location                          |
|------------|------|------------------------------------------|
| PostgreSQL | 5432 | `docker-compose.yml`                     |
| Backend    | 8080 | `backend/src/main/resources/application.properties` |
| Frontend   | 5173 | Vite default (proxy target is 8080)      |

**Rules (mandatory, no exceptions):**
1. Each service MUST run on its designated port above.
2. Before starting any server, check if the port is already in use.
3. If the port is occupied, **kill the existing process first**, then start the server on the correct port.
4. NEVER start a server on an alternative port as a workaround (e.g., 8081, 5174). Doing so will break the proxy and CORS configuration.

Port check & kill commands:
```bash
# Check what is using a port (Windows)
netstat -ano | grep :<PORT>
# Kill by PID
taskkill /PID <PID> /F

# Check what is using a port (Unix/Git Bash)
lsof -ti :<PORT> | xargs kill -9
```

## Local Development Commands
```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Backend — must run on port 8080
cd backend && ./gradlew bootRun

# 3. Frontend — must run on port 5173
cd frontend && npm run dev
```

## Key Paths
- Backend source: `backend/src/main/java/com/taskmanagement/backend/`
- DB migrations: `backend/src/main/resources/db/migration/`
- Requirements docs: `docs/`
- Docker config: `docker-compose.yml`, `backend/Dockerfile`
