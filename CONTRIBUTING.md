# 🎄 Contributing to Pien's Kerstfilm Bonanza

Bedankt voor je interesse! Hier is hoe je kunt bijdragen.

## Development Setup

1. **Clone repository**
```bash
git clone <repo-url>
cd pienskerstfilmbonanza
```

2. **Environment setup**
```bash
cp env.example .env
# Vul je credentials in
```

3. **Start development environment**
```bash
docker compose up -d
```

4. **Eerste keer setup**
```bash
# Seed genres
docker compose exec backend python -m scripts.seed_genres
```

## Project Structuur

```
pienskerstfilmbonanza/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Core functionality
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   └── scripts/         # Utility scripts
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React Context
│   │   └── styles/      # CSS files
│   └── public/          # Static assets
├── database/            # DB scripts
├── nginx/               # Nginx config
└── scripts/             # Deployment scripts
```

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Document functions with docstrings

### JavaScript (Frontend)
- Use functional components
- Follow React hooks best practices
- Use meaningful variable names

### CSS
- Maintain 90's aesthetic!
- Use CSS variables from `index.css`
- Keep it festive 🎄

## Adding Features

### Backend Feature
1. Create model in `backend/app/models/`
2. Create schema in `backend/app/schemas/`
3. Add endpoints in `backend/app/api/`
4. Create migration: `docker compose exec backend alembic revision --autogenerate -m "description"`

### Frontend Feature
1. Create component in `frontend/src/components/`
2. Add page in `frontend/src/pages/` if needed
3. Add styles in `frontend/src/styles/`
4. Update routing in `App.jsx` if needed

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Pull Requests

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit PR with clear description

## Questions?

Open an issue or discussion!

Happy coding! 🎅❄️

