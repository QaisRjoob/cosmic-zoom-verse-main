# Cosmic Zoom Verse

An immersive 3D space explorer for AI-powered exoplanet detection. Journey from Earth through the Solar System to distant galaxies, submit Kepler Object of Interest (KOI) data, and get instant machine learning classifications — **CONFIRMED**, **CANDIDATE**, or **FALSE POSITIVE**.

> Powered by the [KOI Classifier API](https://github.com/Baraa-Rj/trying-to-train) backend — a LightGBM + XGBoost stacking ensemble with 95%+ accuracy.

---

## Preview

| Space Journey | Exoplanet Entry | Model Metrics |
|---|---|---|
| Interactive 3D Earth → Galaxy zoom | KOI parameter form + live prediction | Accuracy, F1, confusion matrix |

---

## Features

- **Interactive 3D scene** — navigate Earth, Solar System, and galaxy views built with Three.js
- **Live AI classification** — submit KOI parameters and get real-time predictions from the ML backend
- **Batch & CSV upload** — classify thousands of KOI records at once
- **My Planets dashboard** — save, browse, and delete your prediction records
- **Model metrics page** — live accuracy, precision, recall, F1 score, and confusion matrix
- **Responsive design** — works on desktop and mobile
- **Offline fallback** — local storage keeps your planets accessible if the API is down

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| 3D Graphics | Three.js · React Three Fiber · Drei |
| UI Components | shadcn/ui · Radix UI |
| Styling | Tailwind CSS + custom cosmic theme |
| Routing | React Router DOM v6 |
| Data Fetching | TanStack Query (React Query) v5 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── App.tsx                        # Root app with route definitions
├── pages/
│   ├── Index.tsx                  # Home — 3D space journey
│   ├── ExoplanetPage.tsx          # KOI data entry & prediction
│   ├── MyPlanetsPage.tsx          # Saved planets dashboard
│   ├── ModelMetricsPage.tsx       # Training metrics & charts
│   └── NotFound.tsx               # 404
├── components/
│   ├── SpaceBackground3D.tsx      # Three.js canvas wrapper
│   ├── SpaceJourney.tsx           # Earth → Galaxy navigation
│   ├── Earth.tsx / SolarSystem.tsx / GalaxyView.tsx
│   ├── ExoplanetSystem.tsx        # Exoplanet orbit visualization
│   ├── ExoplanetDataEntry.tsx     # KOI input form
│   ├── MyPlanets.tsx              # Planet list & detail view
│   ├── ModelMetrics.tsx           # Metrics dashboard
│   ├── ModelTraining.tsx          # Training trigger & progress
│   ├── DataUploadSection.tsx      # CSV bulk upload
│   ├── Dashboard.tsx              # Quick stats overview
│   ├── ParticleField.tsx          # Animated star particles
│   └── ui/                        # shadcn/ui base components
├── controllers/
│   └── ExoplanetController.ts     # API calls + local storage fallback
├── lib/
│   ├── api.ts                     # Typed API service (all backend calls)
│   └── utils.ts
├── models/
│   └── ExoplanetModel.ts          # Data model & Zod validation
└── hooks/
    ├── use-mobile.tsx
    └── use-toast.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh/)
- The [KOI Classifier API](https://github.com/Baraa-Rj/trying-to-train) running on port `8000`

### Installation

```bash
# Clone the repository
git clone https://github.com/QaisRjoob/cosmic-zoom-verse-main.git
cd cosmic-zoom-verse-main

# Install dependencies
npm install
# or
bun install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

For local network access (e.g., running the backend on another machine):

```env
VITE_API_URL=http://192.168.1.x:8000
```

### Running the App

```bash
# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Pages

### Home `/`
An animated space journey — a loading screen gives way to a full-screen 3D scene. Navigate from Earth through the Solar System out to the Milky Way. The title panel auto-hides after 5 seconds.

### Exoplanet `/exoplanet`
Submit 40+ KOI parameters (orbital period, planet radius, stellar temperature, transit SNR, etc.) via a validated form. The backend returns a prediction with class probabilities. Results display inline alongside a 3D exoplanet orbit visualization.

### My Planets `/my-planets`
Browse all saved planet predictions. View full details for each record, or delete ones you no longer need. Falls back to local storage if the API is unavailable.

### Model Metrics `/metrics`
Live dashboard showing the ML model's test-set performance: accuracy, precision, recall, F1 score, class-by-class breakdown, confusion matrix, and training history.

---

## Backend Integration

All API calls go through `src/lib/api.ts`. The base URL is read from `VITE_API_URL`.

| Action | Endpoint |
|---|---|
| Single prediction | `POST /predict` |
| Batch prediction | `POST /predict/batch` |
| CSV upload | `POST /predict/csv` |
| Save planet | `POST /planets/predict-and-save` |
| List planets | `GET /planets/list` |
| Delete planet | `DELETE /planets/{id}` |
| Model info | `GET /model/info` |
| Model metrics | `GET /model/statistics` |
| Retrain model | `POST /training/start` |

---

## Styling & Theme

Tailwind CSS is extended with a custom cosmic palette:

| Token | Usage |
|---|---|
| `cosmic-glow` | Accent highlights |
| `stellar-purple` | Primary interactive elements |
| `nebula-pink` | Gradient accents |
| `star-white` | Text on dark backgrounds |

Custom animations include `spin-slow`, `float`, and `pulse-glow` for the space atmosphere. Dark mode is supported via `next-themes`.

---

## Backend

This frontend is designed to work with the **KOI Classifier API**:

**Repository:** [https://github.com/Baraa-Rj/trying-to-train](https://github.com/Baraa-Rj/trying-to-train)  
**Stack:** Python · FastAPI · LightGBM · XGBoost · scikit-learn  
**Default port:** `8000`

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/) for the Kepler KOI dataset
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for declarative Three.js in React
- [shadcn/ui](https://ui.shadcn.com/) for accessible, composable UI components
