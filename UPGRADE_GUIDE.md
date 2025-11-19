# 🚀 Upgrade Guide v1.0 → v1.1

Deze guide helpt je om van versie 1.0 naar 1.1 te upgraden met alle nieuwe dependencies en features.

## ⚠️ Breaking Changes

### 1. CORS Configuration
De `CORS_ORIGINS` moet nu als comma-separated string in plaats van JSON:

**Oud (werkt niet meer):**
```env
CORS_ORIGINS=["http://localhost:3000"]
```

**Nieuw:**
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 2. ESLint Configuration
ESLint is geüpdatet naar v9 met Flat Config. Oude `.eslintrc*` files werken niet meer.

**Actie:** De nieuwe `eslint.config.js` is al aangemaakt. Verwijder oude config files.

### 3. Docker Images
Nieuwe base images vereisen mogelijk herbuilds:
- Node 18 → 22
- Python 3.11 → 3.13
- PostgreSQL 15 → 17

## 📋 Upgrade Stappen

### Stap 1: Backup
```bash
# Backup database
docker compose exec db pg_dump -U pienskerst kerstfilms > backup_$(date +%Y%m%d).sql

# Backup .env
cp .env .env.backup
```

### Stap 2: Stop Containers
```bash
docker compose down
```

### Stap 3: Pull Latest Code
```bash
git pull origin main
```

### Stap 4: Update .env
Voeg nieuwe variabelen toe aan je `.env`:

```env
# Voor Traefik deployment (nieuw in v1.1)
DOMAIN=jouwdomein.nl

# Update CORS naar comma-separated format
CORS_ORIGINS=https://jouwdomein.nl

# Update API URL voor Traefik
VITE_API_URL=https://jouwdomein.nl/api
```

### Stap 5: Rebuild & Start
```bash
# Development
docker compose up -d --build

# Production met Traefik
docker compose -f docker-compose.prod.yml up -d --build
```

### Stap 6: Verify
```bash
# Check logs
docker compose logs -f backend
docker compose logs -f frontend

# Test health
curl http://localhost:8000/health
```

## 🆕 Nieuwe Features

### Traefik Integration (Production)
Als je Traefik gebruikt, voeg deze toe aan je `.env`:

```env
DOMAIN=pienskerstfilmbonanza.nl
CORS_ORIGINS=https://pienskerstfilmbonanza.nl
VITE_API_URL=https://pienskerstfilmbonanza.nl/api
```

De `docker-compose.prod.yml` bevat nu Traefik labels voor:
- ✅ Automatische HTTPS (Let's Encrypt)
- ✅ HTTP → HTTPS redirect
- ✅ API path prefix stripping

### Development vs Production

**Development (.env.dev):**
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
VITE_API_URL=http://localhost:8000
```

**Production (.env.prod):**
```env
CORS_ORIGINS=https://jouwdomein.nl
VITE_API_URL=https://jouwdomein.nl/api
DOMAIN=jouwdomein.nl
```

## 🔧 Lokale Development Updates

Als je lokaal ontwikkelt (zonder Docker):

### Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend
```bash
cd backend
rm -rf venv
python3.13 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🐛 Troubleshooting

### CORS Error na upgrade
**Probleem:** `error parsing value for field "CORS_ORIGINS"`

**Oplossing:** Update `.env` naar comma-separated format:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend build fails
**Probleem:** `npm ci` fails met missing package-lock.json

**Oplossing:** Dit is gefixed. De Dockerfile gebruikt nu `npm install`.

### Backend startup error
**Probleem:** `declarative_base() deprecated`

**Oplossing:** Pull de laatste code. Dit is al gefixed in v1.1.

### Database connection issues
**Probleem:** PostgreSQL 17 compatibility

**Oplossing:** 
```bash
# Rebuild database met nieuwe image
docker compose down -v
docker compose up -d
docker compose exec backend python -m scripts.seed_genres
```

## 📊 Database Migrations

PostgreSQL 15 → 17 is backward compatible. Geen migrations nodig.

Als je toch een fresh start wilt:
```bash
docker compose down -v
docker compose up -d
docker compose exec backend python -m scripts.seed_genres
```

## ✅ Post-Upgrade Checklist

- [ ] Backup gemaakt
- [ ] `.env` geüpdatet met nieuwe format
- [ ] Containers gerebuild met `--build`
- [ ] Backend health check succesvol
- [ ] Frontend bereikbaar
- [ ] Admin login werkt
- [ ] TMDB search werkt
- [ ] Reviews kunnen aangemaakt worden

## 🆘 Hulp Nodig?

Als je problemen hebt:
1. Check de logs: `docker compose logs -f`
2. Verify `.env` format matches voorbeelden hierboven
3. Try fresh rebuild: `docker compose down -v && docker compose up -d --build`
4. Check CHANGELOG.md voor alle wijzigingen

Happy upgrading! 🎄

