Ik wil een hippe, 90's, kerst stijl website waar kerstfilm reviews komen

## Features
- index
- kerstreviews met thumbnail, evt opgehaald bij imdb of een gratis alternatiews in vakjes langs en onder elkaar
- als je er op klikt krijg je de full review
- about page over pien
- filter opties (jaar, rating, wanneer gekeken, subgenre)
- rating systeem (x aantal Arty's op 10 - Arty is de kat)
- een apart portal waar pien haar reviews aan de hand van een form kan invullen (met login)
- achtergrond met vallende sneeuwvlokjes

## Tech Stack
- **Frontend**: React + Node.js
- **Backend**: Python (FastAPI) of Go (Gin/Echo)
- **Database**: PostgreSQL
- **Hosting**: Eigen VPS met Docker containers
- **Film API**: TMDB (The Movie Database) - gratis alternatief
- **Mobile-friendly**: Responsive design

---

# 📋 STAPPENPLAN

## FASE 1: Project Setup & Infrastructuur (Week 1)

### 1.1 Development Environment
- [ ] Repository aanmaken (Git)
- [ ] Project structuur opzetten:
  ```
  pienskerstfilmbonanza/
  ├── frontend/          # React app
  ├── backend/           # Python/Go API
  ├── database/          # PostgreSQL init scripts
  ├── docker/            # Docker configs
  └── docs/              # Documentatie
  ```
- [ ] Git .gitignore configureren
- [ ] README.md met development instructies

### 1.2 Docker Setup
- [ ] `docker-compose.yml` aanmaken met services:
  - PostgreSQL container
  - Backend API container
  - Frontend container (dev + prod builds)
  - Nginx reverse proxy container
- [ ] Environment variables setup (.env files)
- [ ] Docker volumes voor database persistence
- [ ] Docker network configuratie

### 1.3 Database Schema Design
- [ ] Database schema ontwerpen:
  - **users** tabel (admin login)
  - **movies** tabel (film basis info)
  - **reviews** tabel (Pien's reviews)
  - **genres** tabel (subgenres)
  - **movie_genres** junction tabel
- [ ] PostgreSQL init script schrijven
- [ ] Database migratie strategie bepalen (Alembic voor Python / Goose voor Go)

---

## FASE 2: Backend Development (Week 2-3)

### 2.1 Backend Basis Setup
**Python optie (FastAPI):**
- [ ] FastAPI project initialiseren
- [ ] SQLAlchemy ORM setup
- [ ] Alembic voor database migraties
- [ ] Pydantic models voor data validatie

**Go optie (alternatief):**
- [ ] Go project met Gin/Echo framework
- [ ] GORM of sqlx voor database
- [ ] Migratie tool (golang-migrate)

### 2.2 Database Models & Migrations
- [ ] User model (admin authenticatie)
- [ ] Movie model (titel, jaar, TMDB ID, poster URL, etc.)
- [ ] Review model (review tekst, rating, datum gekeken, etc.)
- [ ] Genre model (kerstfilm subgenres)
- [ ] Relaties tussen models definiëren
- [ ] Eerste migratie uitvoeren

### 2.3 Authentication System
- [ ] JWT token implementatie
- [ ] Login endpoint (`POST /api/auth/login`)
- [ ] Token verificatie middleware
- [ ] Password hashing (bcrypt)
- [ ] Protected routes configureren
- [ ] Admin user seeding script

### 2.4 API Endpoints - Public
- [ ] `GET /api/movies` - Lijst van alle films met reviews
- [ ] `GET /api/movies/:id` - Individuele film met volledige review
- [ ] `GET /api/movies?year=2023` - Filter op jaar
- [ ] `GET /api/movies?rating=8` - Filter op rating
- [ ] `GET /api/movies?genre=romantic` - Filter op subgenre
- [ ] `GET /api/movies?watched_date=2024-12` - Filter op wanneer gekeken
- [ ] Combinatie filters ondersteunen
- [ ] Paginatie implementeren

### 2.5 API Endpoints - Admin (Protected)
- [ ] `POST /api/admin/reviews` - Nieuwe review toevoegen
- [ ] `PUT /api/admin/reviews/:id` - Review updaten
- [ ] `DELETE /api/admin/reviews/:id` - Review verwijderen
- [ ] `POST /api/admin/movies/search-tmdb` - TMDB film zoeken
- [ ] Input validatie voor alle endpoints

### 2.6 TMDB API Integratie
- [ ] TMDB API key registreren (gratis)
- [ ] TMDB client implementeren
- [ ] Film zoeken functionaliteit
- [ ] Poster/thumbnail automatisch ophalen
- [ ] Film metadata (jaar, cast, plot) ophalen
- [ ] Rate limiting handling

### 2.7 Backend Testing
- [ ] Unit tests voor belangrijkste functies
- [ ] API endpoint tests
- [ ] Postman/Insomnia collectie maken voor testen

---

## FASE 3: Frontend Development (Week 4-5)

### 3.1 React Project Setup
- [ ] Create React App of Vite setup
- [ ] Folder structuur organiseren:
  ```
  src/
  ├── components/     # Herbruikbare components
  ├── pages/          # Page components
  ├── services/       # API calls
  ├── context/        # React Context (auth state)
  ├── hooks/          # Custom hooks
  ├── styles/         # CSS/SCSS files
  └── assets/         # Images, fonts, etc.
  ```
- [ ] React Router setup
- [ ] Axios of Fetch voor API calls

### 3.2 90's Kerstsfeer Styling
- [ ] CSS framework kiezen (Styled Components / CSS Modules / Tailwind)
- [ ] 90's design research:
  - Felle kleuren (rood, groen, goud)
  - Retro fonts (Comic Sans vibes maar beter)
  - Gekleurde borders en schaduwen
  - Tiled achtergronden mogelijk
- [ ] Kerst kleurenpalet definiëren
- [ ] Custom Arty rating component (kattenkoppen)
- [ ] Placeholder Arty icoon maken
- [ ] Responsive breakpoints definiëren

### 3.3 Sneeuwvlokjes Animatie
- [ ] CSS animatie voor vallende sneeuw
- [ ] React component voor sneeuweffect
- [ ] Performance optimalisatie (Canvas of CSS?)
- [ ] Toggle optie (voor mobiel/performance)

### 3.4 Pages - Public Views

**Homepage (Index)**
- [ ] Hero sectie met kerst thema
- [ ] Uitgelichte reviews
- [ ] Call-to-action naar alle reviews
- [ ] 90's styling elementen

**Reviews Overzicht Pagina**
- [ ] Grid layout voor film cards
- [ ] Film card component:
  - Thumbnail/poster
  - Titel
  - Jaar
  - Arty rating
  - Korte preview tekst
- [ ] Hover effecten
- [ ] Responsive grid (1/2/3/4 kolommen)

**Filter Sidebar/Panel**
- [ ] Jaar filter (dropdown of slider)
- [ ] Rating filter (Arty's selecteren)
- [ ] Datum gekeken filter (maand picker)
- [ ] Subgenre checkboxes
- [ ] "Reset filters" knop
- [ ] Active filter indicators
- [ ] Mobile: collapsible filter menu

**Detail Pagina (Individuele Review)**
- [ ] Grote poster image
- [ ] Film metadata (titel, jaar, cast)
- [ ] Volledige review tekst
- [ ] Arty rating prominent
- [ ] Datum wanneer gekeken
- [ ] Subgenre tags
- [ ] Terug knop
- [ ] Social share buttons (optioneel)

**About Pagina**
- [ ] Over Pien sectie
- [ ] Waarom kerstfilms?
- [ ] Leuke foto's/styling
- [ ] Contact info (optioneel)

### 3.5 Pages - Admin Portal

**Admin Login Pagina**
- [ ] Login form (username/email + password)
- [ ] Kerst-themed maar functioneel
- [ ] Error handling
- [ ] Token opslaan (localStorage/sessionStorage)
- [ ] Redirect na login

**Admin Dashboard**
- [ ] Overzicht van alle reviews
- [ ] Quick stats (totaal aantal reviews, gemiddelde rating)
- [ ] "Nieuwe review" knop
- [ ] Edit/Delete knoppen per review
- [ ] Logout functionaliteit

**Review Form (Create/Edit)**
- [ ] TMDB film zoeken (autocomplete)
- [ ] Film selecteren uit zoekresultaten
- [ ] Manual film info override optie
- [ ] Review tekst (textarea, rich text editor optioneel)
- [ ] Arty rating selector (1-10)
- [ ] Datum gekeken (date picker)
- [ ] Subgenre selectie (checkboxes)
- [ ] Poster upload/URL override
- [ ] Preview functionaliteit
- [ ] Submit & validatie
- [ ] Unsaved changes warning

### 3.6 State Management
- [ ] React Context voor authenticatie
- [ ] Context voor filters
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications voor admin acties

### 3.7 Responsiveness
- [ ] Mobile design (< 768px)
- [ ] Tablet design (768px - 1024px)
- [ ] Desktop design (> 1024px)
- [ ] Touch-friendly buttons/links
- [ ] Hamburger menu voor mobiel
- [ ] Test op verschillende devices

---

## FASE 4: Integratie & Testing (Week 6)

### 4.1 Frontend-Backend Integratie
- [ ] API service layer implementeren
- [ ] Error handling voor API calls
- [ ] Loading indicators
- [ ] Retry logic voor failed requests
- [ ] CORS configuratie controleren

### 4.2 Testing
- [ ] Handmatige testing alle flows:
  - Film browsing met filters
  - Review detail bekijken
  - Admin login
  - Review toevoegen/bewerken/verwijderen
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsive testing
- [ ] Performance testing (Lighthouse)
- [ ] Security testing (SQL injection, XSS)

### 4.3 Bug Fixes & Polish
- [ ] Bug lijst maken en fixen
- [ ] UI polish (spacing, colors, animations)
- [ ] Loading states verbeteren
- [ ] Error messages gebruiksvriendelijk maken
- [ ] 404 pagina stylen

---

## FASE 5: Deployment (Week 7)

### 5.1 Production Docker Setup
- [ ] Production `docker-compose.yml`
- [ ] Environment variables voor production
- [ ] Nginx configuratie:
  - Reverse proxy naar backend
  - Static file serving voor frontend
  - SSL/TLS setup (Let's Encrypt)
  - Gzip compressie
  - Security headers
- [ ] PostgreSQL backup strategie
- [ ] Docker health checks

### 5.2 VPS Setup
- [ ] VPS server provisioning
- [ ] Docker & Docker Compose installeren
- [ ] Firewall configuratie (UFW)
- [ ] SSH key setup
- [ ] Domain DNS configuratie
- [ ] SSL certificaat (Certbot)

### 5.3 CI/CD (Optioneel maar aanbevolen)
- [ ] GitHub Actions / GitLab CI setup
- [ ] Automated testing
- [ ] Automated deployment naar VPS
- [ ] Deployment rollback strategie

### 5.4 Monitoring & Maintenance
- [ ] Logging setup (backend)
- [ ] Error tracking (Sentry optioneel)
- [ ] Database backup script (cronjob)
- [ ] Uptime monitoring
- [ ] Docker container auto-restart policy

### 5.5 Go Live
- [ ] Final production test
- [ ] Database seeden met eerste reviews
- [ ] Admin account aanmaken
- [ ] Echte Arty foto uploaden (kattenkoppen!)
- [ ] Smoke tests na deployment
- [ ] 🎉 Website live!

---

## FASE 6: Post-Launch (Ongoing)

### 6.1 Content
- [ ] Pien kan reviews gaan toevoegen
- [ ] Eerste 10-20 kerstfilms reviewen
- [ ] About pagina invullen

### 6.2 Verbeteringen (Nice-to-have)
- [ ] Zoekfunctionaliteit (search bar)
- [ ] Sorteer opties (nieuwste eerst, hoogste rating, etc.)
- [ ] Comments sectie (optioneel)
- [ ] "Favorite" functionaliteit
- [ ] Statistieken pagina (meest gekeken genres, etc.)
- [ ] Email notificaties bij nieuwe reviews (nieuwsbrief)
- [ ] Social media integratie
- [ ] Google Analytics (privacy-vriendelijk)
- [ ] Dark mode toggle
- [ ] Meer sneeuw effecten / kerst animaties

### 6.3 Performance Optimalisatie
- [ ] Image optimization (WebP, lazy loading)
- [ ] Code splitting (React.lazy)
- [ ] Caching strategie
- [ ] Database query optimalisatie
- [ ] CDN voor static assets (optioneel)

---

## 🎯 PRIORITEITEN

**Must Have (MVP)**
1. Film overzicht met filters
2. Review detail pagina
3. Admin login + review form
4. 90's kerst styling
5. Sneeuwvlokjes
6. Responsive design
7. Docker deployment

**Nice to Have (Later)**
1. Zoekfunctionaliteit
2. Sorteer opties
3. Rich text editor voor reviews
4. Advanced analytics
5. Social sharing
6. Comments

---

## 📝 NOTES

- **Arty foto**: Placeholder gebruiken totdat echte kattenkop foto beschikbaar is
- **TMDB API key**: Registreer op https://www.themoviedb.org/settings/api
- **Backend keuze**: Beide opties werken goed:
  - Python (FastAPI): Sneller te ontwikkelen, grotere community
  - Go: Betere performance, statically typed
  - **Aanbeveling**: Start met Python/FastAPI tenzij je Go al goed kent
- **90's stijl inspiratie**: 
  - Space Jam website (archived)
  - Geocities aesthetics
  - Windows 95 UI elementen
  - Fel gekleurd maar niet te overdreven

---

## ⏱️ GESCHATTE TIJDLIJN

- **Totaal**: 7-8 weken part-time (15-20 uur/week)
- **MVP (minimum viable product)**: 5-6 weken
- **Full featured**: 7-8 weken
- **Met alle bells & whistles**: 10-12 weken

**Let op**: Als je fulltime eraan werkt kan het in 3-4 weken!

