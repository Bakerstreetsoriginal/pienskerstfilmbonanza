# Changelog

All notable changes to Pien's Kerstfilm Bonanza will be documented in this file.

## [1.1.0] - 2025-11-19

### 🚀 Major Updates

#### Frontend
- ⬆️ React: 18.2.0 → 18.3.1
- ⬆️ React Router: 6.20.0 → 6.28.0
- ⬆️ Vite: 5.0.8 → 6.0.1
- ⬆️ Axios: 1.6.2 → 1.7.7
- ⬆️ ESLint: 8.55.0 → 9.14.0 (with Flat Config)
- ⬆️ All React plugins updated to latest versions

#### Backend
- ⬆️ FastAPI: 0.104.1 → 0.115.5
- ⬆️ Uvicorn: 0.24.0 → 0.32.1
- ⬆️ SQLAlchemy: 2.0.23 → 2.0.36
- ⬆️ Pydantic: 2.5.0 → 2.10.2
- ⬆️ Pydantic Settings: 2.1.0 → 2.6.1
- ⬆️ HTTPX: 0.25.1 → 0.27.2
- ⬆️ All other dependencies updated

#### Docker
- ⬆️ Node: 18-alpine → 22-alpine (LTS)
- ⬆️ Python: 3.11-slim → 3.13-slim
- ⬆️ PostgreSQL: 15-alpine → 17-alpine
- ⬆️ Nginx: alpine → 1.27-alpine

### 🔧 Code Improvements

#### Backend Refactoring
- ✅ Migrated from deprecated `@app.on_event()` to modern `lifespan` context manager
- ✅ Updated SQLAlchemy from `declarative_base()` to `DeclarativeBase` class
- ✅ Fixed Pydantic v2 settings configuration with `model_config`
- ✅ Improved CORS_ORIGINS parsing to handle comma-separated strings

#### Frontend Refactoring
- ✅ Added modern ESLint 9 Flat Config format (`eslint.config.js`)
- ✅ Updated ESLint rules to match latest best practices
- ✅ Simplified lint script in package.json

#### Infrastructure
- ✅ Added Traefik integration for production deployment
- ✅ Configured automatic HTTPS with Let's Encrypt
- ✅ Added support for HTTP → HTTPS redirects
- ✅ API path prefix stripping middleware

### 📚 Documentation
- ✅ Updated README.md with latest tech stack versions
- ✅ Updated START_HERE.md with current prerequisites
- ✅ Added CHANGELOG.md for version tracking
- ✅ Updated env.example with DOMAIN variable for Traefik

### 🔒 Security
- ⬆️ All dependencies updated to latest secure versions
- ✅ Fixed potential vulnerabilities in outdated packages

---

## [1.0.0] - Initial Release

### Features
- 🎄 Kerstfilm review system with TMDB integration
- 🐱 Arty rating system (1-10 cat heads)
- 🎨 90's Christmas aesthetic with snowfall animation
- 🔐 Admin authentication and review management
- 🔍 Advanced filtering (year, rating, genre, date)
- 📱 Fully responsive design
- 🐳 Docker Compose deployment

