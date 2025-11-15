# 🎄 START HERE - Quick Start Guide

Welkom bij Pien's Kerstfilm Bonanza! Dit is je quick start gids.

## 🚀 Snel Aan De Slag (5 minuten)

### 1. Prerequisites
Zorg dat je hebt:
- [x] Docker & Docker Compose geïnstalleerd
- [x] TMDB API key (gratis op https://www.themoviedb.org/settings/api)

### 2. Setup Environment

Maak `.env` file aan (Windows PowerShell):
```powershell
Copy-Item env.example .env
notepad .env
```

Of (Unix/Mac):
```bash
cp env.example .env
nano .env
```

**Minimaal invullen:**
```env
TMDB_API_KEY=jouw_tmdb_api_key_hier
ADMIN_EMAIL=pien@example.com
ADMIN_PASSWORD=jouw_wachtwoord
SECRET_KEY=een_lange_random_string_minimaal_32_chars
```

### 3. Start de applicatie

```bash
docker compose up -d
```

Wacht ~30 seconden voor de database...

### 4. Seed Genres

```bash
docker compose exec backend python -m scripts.seed_genres
```

### 5. Open de applicatie

🌐 **Frontend**: http://localhost:3000  
🔧 **Backend API**: http://localhost:8000  
📚 **API Docs**: http://localhost:8000/docs  
🔐 **Admin Login**: http://localhost:3000/admin/login

## 📝 Eerste Stappen

1. **Login als admin**
   - Ga naar http://localhost:3000/admin/login
   - Gebruik je ADMIN_EMAIL en ADMIN_PASSWORD uit .env

2. **Voeg je eerste review toe**
   - Klik op "+ Nieuwe Review"
   - Zoek een kerstfilm op TMDB
   - Schrijf je review
   - Geef Arty rating
   - Save!

3. **Bekijk je review**
   - Ga naar homepage
   - Zie je review verschijnen!

## 🎨 Features

- ✅ Film reviews met TMDB integratie
- ✅ Arty rating systeem (1-10 kattenkoppen)
- ✅ Filters (jaar, rating, genre, datum)
- ✅ Admin portal met authenticatie
- ✅ 90's kerst styling met sneeuwvlokjes ❄️
- ✅ Volledig responsive

## 🔧 Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Logs Bekijken
```bash
docker compose logs -f backend
docker compose logs -f frontend
```

### Database Toegang
```bash
docker compose exec db psql -U pienskerst -d kerstfilms
```

## 📚 Meer Informatie

- **Volledige documentatie**: README.md
- **Deployment guide**: DEPLOYMENT.md
- **Contributing**: CONTRIBUTING.md
- **Project design**: Design.md

## ❓ Problemen?

### "Port already in use"
Stop andere services op poort 3000, 8000, of 5432.

### "Database connection failed"
Wacht even langer, database heeft tijd nodig om op te starten.

### "TMDB search werkt niet"
Check je TMDB_API_KEY in .env.

### Containers resetten
```bash
docker compose down -v
docker compose up -d
docker compose exec backend python -m scripts.seed_genres
```

## 🎁 Tips

1. **Upload Arty foto**: Plaats `arty-head.png` in `frontend/src/assets/`
2. **Customize colors**: Bewerk CSS variabelen in `frontend/src/styles/index.css`
3. **Add genres**: Voeg toe aan `backend/scripts/seed_genres.py`

## 🎄 Veel Plezier!

Begin met het reviewen van je favoriete kerstfilms!

Vragen? Open een issue op GitHub.

Happy reviewing! 🎅❄️

