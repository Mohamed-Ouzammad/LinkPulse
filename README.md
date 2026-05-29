# LinkPulse 🔗

SaaS de bio page & gestion de liens avec analytics.

## Structure

```
linkpulse/
├── frontend/   → React (Vite)
└── backend/    → Node.js + Express
```

## Installation

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # Remplir les variables
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # Remplir les variables
npm run dev
```

## Variables d'environnement

### Backend `.env`
```
PORT=4000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=supersecretkey
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:4000
```

## Stack
- **Frontend** : React 18, Vite, React Router, Recharts, Google Fonts
- **Backend** : Node.js, Express, Supabase (PostgreSQL + Auth)
- **Base de données** : Supabase (schéma dans `backend/supabase_schema.sql`)
