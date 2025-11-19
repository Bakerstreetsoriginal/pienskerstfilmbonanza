# 🎄 Pien's Kerst Film Bonanza

Een hippe 90's-stijl website voor kerstfilm reviews met vallende sneeuwvlokjes en Arty-ratings!

## ✨ Features

- 📽️ Kerstfilm reviews met TMDB integratie
- 🐱 Arty rating systeem (1-10 kattenkoppen)
- 🎨 90's kerst aesthetiek
- ❄️ Vallende sneeuwvlokjes animatie
- 🔍 Filter op jaar, rating, genre, en datum
- 🔐 Admin portal voor review management
- 📱 Volledig responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18.3 + Vite 6.0
- **Backend**: Python 3.13 + FastAPI 0.115
- **Database**: PostgreSQL 17
- **Deployment**: Docker Compose + Traefik
- **API**: TMDB (The Movie Database)

### Key Dependencies (Updated November 2025)

**Frontend:**
- React 18.3.1 + React Router 6.28
- Vite 6.0.1
- Axios 1.7.7
- ESLint 9.14 (Flat Config)

**Backend:**
- FastAPI 0.115.5
- SQLAlchemy 2.0.36
- Pydantic 2.10.2
- Uvicorn 0.32.1

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 22+ (voor lokale development)
- Python 3.13+ (voor lokale development)

### Development Setup

1. **Clone de repository**
```bash
git clone <repo-url>
cd pienskerstfilmbonanza
```

2. **Environment variabelen**
```bash
cp ENV_TEMPLATE.txt .env
# Bewerk .env en vul je TMDB API key in
```

3. **Start met Docker Compose**
```bash
docker compose up -d
```

4. **Seed genres**
```bash
docker compose exec backend python -m scripts.seed_genres
```

De applicatie is nu beschikbaar op:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Lokale Development (zonder Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📦 Project Structuur

```
pienskerstfilmbonanza/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Config, security
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── main.py      # App entry point
│   ├── alembic/         # Database migrations
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── context/     # React Context
│   │   └── styles/      # CSS files
│   └── package.json
├── database/            # DB init scripts
├── nginx/               # Nginx config
├── docker-compose.yml   # Docker orchestration
└── Design.md           # Project design doc
```

## 🔑 Environment Variabelen

Maak een `.env` file aan in de root directory:

```env
# Database
POSTGRES_USER=pienskerst
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=kerstfilms
DATABASE_URL=postgresql://pienskerst:your_secure_password@db:5432/kerstfilms

# Backend
SECRET_KEY=your_secret_key_here_change_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# TMDB API
TMDB_API_KEY=your_tmdb_api_key_here

# Admin (first user)
ADMIN_EMAIL=pien@example.com
ADMIN_PASSWORD=change_this_password
```

## 🎬 TMDB API Key

1. Ga naar https://www.themoviedb.org/
2. Maak een gratis account
3. Ga naar Settings > API
4. Vraag een API key aan (kies "Developer")
5. Voeg de key toe aan je `.env` file

## 🐳 Deployment naar VPS

Zie **DEPLOYMENT.md** voor complete deployment instructies.

Quick deployment:
```bash
./scripts/deploy.sh
```

## 📊 Database Migraties

```bash
# Maak nieuwe migratie
docker compose exec backend alembic revision --autogenerate -m "Description"

# Run migraties
docker compose exec backend alembic upgrade head

# Rollback
docker compose exec backend alembic downgrade -1
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 Admin Login

Na eerste deployment:
- URL: http://localhost:3000/admin
- Email: Zoals ingesteld in .env (ADMIN_EMAIL)
- Password: Zoals ingesteld in .env (ADMIN_PASSWORD)

**⚠️ Verander het admin wachtwoord na eerste login!**

## 🎨 90's Kerst Styling

Het design is geïnspireerd door:
- Windows 95 UI elementen
- Geocities aesthetiek
- Space Jam website vibes
- Felle kerst kleuren (rood, groen, goud)
- Retro fonts en animaties

## 🐱 Arty Rating Systeem

Arty is de kat! Upload een foto van Arty's hoofd naar:
`frontend/src/assets/arty-head.png`

Tot die tijd wordt een placeholder gebruikt.

## 🔧 Troubleshooting

**Database connectie fouten:**
```bash
docker compose down -v
docker compose up -d
```

**Frontend build fouten:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Backend dependency issues:**
```bash
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 📄 License

Private project for Pien's Kerst Film Reviews

## 🎅 Credits

Made with ❄️ by Pien

