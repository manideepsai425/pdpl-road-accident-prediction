# RoadSafe AI — Peddapalli Road Accident Prediction

AI-powered road accident risk prediction system for **Peddapalli District, Telangana**.

Built with FastAPI + VotingClassifier (RandomForest + GradientBoosting) on the backend, React + Framer Motion + Leaflet on the frontend.

---

## Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite, Framer Motion, Recharts, Leaflet|
| Backend   | FastAPI, scikit-learn, pandas, joblib           |
| ML Model  | VotingClassifier (RandomForest + GradientBoosting)|
| Deploy    | Render (backend) · Vercel (frontend)            |
| Dataset   | Synthetic · 500 rows · Peddapalli District      |

---

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m app.ml.train          # Train & save model artifacts
uvicorn app.main:app --reload   # Start API at http://localhost:8000
```

API docs available at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
# Create .env.local:
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev                     # Start at http://localhost:5173
```

---

## Deployment

### Render (Backend)

1. Push repo to GitHub
2. New Web Service → connect repo → set root to `backend/`
3. Build: `pip install -r requirements.txt && python -m app.ml.train`
4. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Vercel (Frontend)

1. New Project → connect repo → set root to `frontend/`
2. Framework: Vite
3. Add env variable: `VITE_API_BASE_URL=https://<your-render-url>`

---

## Dataset

`backend/data/peddapalli_accidents.csv` — 500 synthetically realistic rows covering:
- 15 real road locations in Peddapalli district
- NH-163, Ramagundam Bypass, Godavari Bridge, Manthani Road, and more
- Features: weather, road condition, light, hour, traffic volume, collision type, severity, risk score

Regenerate: `python backend/data/generate_synthetic_data.py`

---

## API Endpoints

| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | `/api/predict/`           | Get accident risk score   |
| GET    | `/api/predict/options`    | Dropdown options           |
| GET    | `/api/analytics/summary`  | District summary stats    |
| GET    | `/api/analytics/hourly`   | Hourly distribution       |
| GET    | `/api/analytics/severity` | Severity breakdown        |
| GET    | `/api/analytics/weather`  | Weather correlation       |
| GET    | `/api/analytics/monthly`  | Monthly trend             |
| GET    | `/api/zones/`             | All risk zones            |
| GET    | `/api/zones/heatmap`      | Heatmap coordinates       |

---

*Peddapalli District, Telangana, India · Built for JNTUH R22 AI-Based Road Accident Prediction (Problem Statement 35)*
