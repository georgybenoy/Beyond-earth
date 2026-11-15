# Beyond Earth 🚀
### NASA Space Apps Challenge — Interactive Solar System Museum

<p align="center">
  <a href="https://beyond-earth-ten.vercel.app/"><strong>🌍 VISIT LIVE WEBSITE</strong></a>
</p>

**Beyond Earth** is an immersive, scientifically authentic educational web platform that chronicles the human-made spacecraft, rovers, landers, and scientific instruments deployed across our solar system since the 1960s.

Designed for students, educators, and space enthusiasts, this digital museum connects scientific discoveries, historical milestones, and space exploration technologies into an interactive space experience.

### 🔗 Project Links

- **Live Website:** https://beyond-earth-ten.vercel.app/
- **GitHub Repository:** https://github.com/JestyJose/Beyond-earth
- **Backend API:** https://beyond-earth-api.onrender.com
- **API Health Check:** https://beyond-earth-api.onrender.com/api/v1/health

---

## 🌟 Key Features

1. **Solar System Explorer**: Interactive 3D & 2D orbital exploration of planets, moons, and deep space destinations hosting NASA hardware.
2. **Hardware Explorer**: Deep-dive profiles of iconic missions (Voyager 1 & 2, Curiosity, Perseverance, Cassini, New Horizons, Apollo 11, and more) with scientific payloads, launch stats, and verified sources.
3. **Mission Timeline**: Interactive chronological scrubber detailing pivotal moments from the 1960s to present day.
4. **Science Behind the Machine**: Student-friendly breakdowns explaining *how* deep-space technologies work (RTG nuclear batteries, the Deep Space Network, gravity assists, spectrometers).
5. **Mission Status Tracker**: Telemetry radar categorizing hardware into operational and historical mission states.
6. **Space Academy**: Gamified learning quizzes with difficulty tiers, immediate scientific feedback, and unlockable achievement badges.
7. **Interactive Mission Simulations**: Educational simulations based on real NASA mission scenarios.
8. **Daily Challenges**: Learning challenges and achievements to encourage continued exploration.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Three.js / React Three Fiber, Lucide Icons.
- **Backend**: Node.js, Express.js REST API.
- **Data & Storage**: Local NASA mission seed archives. Supabase integration should be confirmed against the current implementation.
- **External Data**: NASA NSSDCA, JPL Solar System Dynamics, NASA Open APIs.

---

## 📂 Project Structure

```text
beyond-earth/
├── client/                  # React + Vite frontend application
│   └── src/
│       ├── components/      # UI components (3D canvas, common, hardware, timeline, academy)
│       ├── config/          # Centralized client configuration
│       ├── context/         # React Context state management (CadetContext)
│       ├── hooks/           # Custom domain hooks (catalog, timeline, 3D navigation)
│       ├── pages/           # Lazy-loaded route views
│       ├── services/        # API client with in-flight deduplication
│       └── utils/           # Date & number formatters
├── server/                  # Node.js + Express backend REST API
│   └── src/
│       ├── config/          # Environment configuration
│       ├── controllers/     # HTTP endpoint handlers
│       ├── data/            # NASA seed files & in-memory O(1) seedStore
│       ├── middleware/      # Rate limiter, errorHandler, asyncHandler
│       ├── routes/          # Express route definitions
│       └── services/        # Pure business logic layer
├── docs/                    # Architecture specifications & scientific references
│   └── ARCHITECTURE.md      # Detailed system architecture & engineering guide
├── tests/                   # Automated API contract & seed integrity test suites
├── test_phase8_validation.js # Automated accessibility & security audit suite
└── README.md                # Project documentation
```

For complete technical specifications, review [ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Root & Test Setup

To run the complete automated validation, API contract, and NASA seed integrity suites:

```bash
npm install
npm test
```

### 2. Backend Server Setup

```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:5000`.

### 3. Frontend Client Setup

```bash
cd client
npm install
npm run dev
```

The client will start on `http://localhost:5173`.

---

## 🌐 Deployment

Beyond Earth is deployed using:

| Component | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://beyond-earth-ten.vercel.app/ |
| Backend | Render | https://beyond-earth-api.onrender.com |
| Source Code | GitHub | https://github.com/JestyJose/Beyond-earth |

The frontend communicates with the backend through the deployed REST API.

---

## 📜 Scientific Sources & Accuracy

Spacecraft information, launch dates, instrument specifications, and mission histories are researched using official NASA archives and references, including:

- [NASA Space Science Data Coordinated Archive (NSSDCA)](https://nssdc.gsfc.nasa.gov/)
- [NASA Jet Propulsion Laboratory (JPL)](https://www.jpl.nasa.gov/)
- [NASA Planetary Data System (PDS)](https://pds.nasa.gov/)
- [NASA Open APIs](https://api.nasa.gov/)

Beyond Earth is an independent educational project developed for the NASA Space Apps Challenge. It is not an official NASA product and is not endorsed by NASA.

---

## 👩‍💻 Repository

Explore the source code, follow development, and contribute:

**[JestyJose / Beyond-earth](https://github.com/JestyJose/Beyond-earth)**

## 🌍 Explore Beyond Earth

**[Launch Beyond Earth →](https://beyond-earth-ten.vercel.app/)**
