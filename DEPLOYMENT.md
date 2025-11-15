# 🚀 Deployment Guide - Pien's Kerstfilm Bonanza

Complete deployment guide voor je VPS.

## 📋 Prerequisites

- VPS met Ubuntu 20.04+ (of Debian)
- Domain naam (optioneel maar aanbevolen)
- SSH toegang tot je server
- Minimaal 2GB RAM aanbevolen

## 1️⃣ Server Setup

### Update systeem
```bash
sudo apt update && sudo apt upgrade -y
```

### Installeer Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

Log uit en weer in om docker zonder sudo te gebruiken.

### Installeer Docker Compose
```bash
sudo apt install docker-compose-plugin -y
```

### Firewall configureren
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

## 2️⃣ Clone Repository

```bash
cd ~
git clone https://github.com/jouw-username/pienskerstfilmbonanza.git
cd pienskerstfilmbonanza
```

## 3️⃣ Environment Setup

### Maak .env file aan
```bash
cp env.example .env
nano .env
```

### Vul in:
```env
# Database
POSTGRES_USER=pienskerst
POSTGRES_PASSWORD=GEBRUIK_HIER_EEN_STERK_WACHTWOORD
POSTGRES_DB=kerstfilms
DATABASE_URL=postgresql://pienskerst:GEBRUIK_HIER_EEN_STERK_WACHTWOORD@db:5432/kerstfilms

# Backend - Genereer een veilige secret key!
SECRET_KEY=GEBRUIK_HIER_MINIMAAL_32_RANDOM_CHARACTERS
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# TMDB API - Krijg je op https://www.themoviedb.org/settings/api
TMDB_API_KEY=jouw_tmdb_api_key_hier

# Admin credentials
ADMIN_EMAIL=pien@jouwdomain.nl
ADMIN_PASSWORD=KIES_EEN_STERK_WACHTWOORD

# CORS (vervang met je domain)
CORS_ORIGINS=http://jouwdomain.nl,https://jouwdomain.nl

# Voor productie build
VITE_API_URL=http://jouwdomain.nl
```

### Veilige SECRET_KEY genereren:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 4️⃣ TMDB API Key

1. Ga naar https://www.themoviedb.org/
2. Maak een gratis account
3. Ga naar Settings > API
4. Vraag een API key aan (kies "Developer")
5. Voeg toe aan `.env`

## 5️⃣ Deploy Applicatie

### Maak deploy script executable
```bash
chmod +x scripts/deploy.sh
chmod +x scripts/backup-db.sh
```

### Run deployment
```bash
./scripts/deploy.sh
```

Dit script doet:
- Pull latest code
- Build Docker images
- Start containers
- Run database migrations
- Seed initial genres

## 6️⃣ SSL/HTTPS Setup (Optioneel maar aanbevolen)

### Installeer Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Verkrijg SSL certificaat
```bash
sudo certbot certonly --standalone -d jouwdomain.nl
```

### Update nginx configuratie
Bewerk `nginx/nginx.conf` om SSL te ondersteunen:

```nginx
server {
    listen 443 ssl http2;
    server_name jouwdomain.nl;

    ssl_certificate /etc/letsencrypt/live/jouwdomain.nl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jouwdomain.nl/privkey.pem;

    # Rest van configuratie...
}

server {
    listen 80;
    server_name jouwdomain.nl;
    return 301 https://$server_name$request_uri;
}
```

### Herstart nginx
```bash
docker compose -f docker-compose.prod.yml restart nginx
```

## 7️⃣ Database Backups

### Manual backup
```bash
./scripts/backup-db.sh
```

### Automatische backups (cronjob)
```bash
crontab -e
```

Voeg toe (dagelijks om 3:00):
```
0 3 * * * cd /home/username/pienskerstfilmbonanza && ./scripts/backup-db.sh >> /home/username/backup.log 2>&1
```

## 8️⃣ Monitoring

### Bekijk logs
```bash
# Alle services
docker compose -f docker-compose.prod.yml logs -f

# Specifieke service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f db
```

### Container status
```bash
docker compose -f docker-compose.prod.yml ps
```

### Resource usage
```bash
docker stats
```

## 9️⃣ Updates Deployen

```bash
cd ~/pienskerstfilmbonanza
./scripts/deploy.sh
```

## 🔧 Troubleshooting

### Containers herstarten
```bash
docker compose -f docker-compose.prod.yml restart
```

### Containers opnieuw builden
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Database reset (⚠️ VERLIEST ALLE DATA!)
```bash
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up -d
```

### Containers en volumes verwijderen
```bash
docker compose -f docker-compose.prod.yml down -v
docker system prune -a
```

### Logs checken voor errors
```bash
docker compose -f docker-compose.prod.yml logs --tail=100 backend
```

## 📊 Database Management

### Toegang tot database
```bash
docker compose -f docker-compose.prod.yml exec db psql -U pienskerst -d kerstfilms
```

### Database restore van backup
```bash
gunzip -c backups/kerstfilms_20240101_120000.sql.gz | \
    docker compose -f docker-compose.prod.yml exec -T db psql -U pienskerst kerstfilms
```

## 🎯 Na Deployment Checklist

- [ ] Website is bereikbaar op je domain
- [ ] Admin login werkt
- [ ] Je kunt inloggen op /admin/login
- [ ] Je kunt een review toevoegen
- [ ] TMDB search werkt
- [ ] Filters werken
- [ ] Mobile responsiveness checken
- [ ] SSL certificaat is actief (als geconfigureerd)
- [ ] Database backups zijn ingesteld

## 🐛 Common Issues

**Issue**: CORS errors in browser console
**Fix**: Check CORS_ORIGINS in .env bevat je domain

**Issue**: Database connection failed
**Fix**: Check DATABASE_URL in .env is correct

**Issue**: TMDB search werkt niet
**Fix**: Verify TMDB_API_KEY in .env is valid

**Issue**: Admin login werkt niet
**Fix**: Check backend logs voor errors, verify SECRET_KEY is set

## 📞 Support

Zie README.md voor meer informatie.

---

Veel succes met je deployment! 🎄❄️

