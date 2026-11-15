# Beyond Earth — System Architecture & Engineering Specifications 🚀

This document details the software architecture, design patterns, security controls, and data contracts implemented across the **Beyond Earth** repository.

---

## 1. High-Level Architecture

Beyond Earth is designed as a decoupled, multi-tier cloud application:

```
[ Client: React + Vite SPA ]
       │
       │ (1) Browser Wire Request
       ▼
[ Vercel Edge Proxy ] ──(Reverse Proxy / Rewrite)──► [ Render Backend: Node.js Express ]
       │                                                          │
       ▼                                                          ▼
[ Client Cache / In-flight Map ]                          [ In-Memory SeedStore ]
                                                          (Immutable O(1) Hash Maps)
```

### Component Tiers

| Tier | Technology | Hosting / Runtime | Primary Responsibility |
|---|---|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, Three.js / R3F | Vercel Edge CDN | Interactive 3D visualization, STEM education, responsive UI, Cadet state management. |
| **Edge Proxy** | Vercel Serverless Rewrites | Vercel Edge Network | Transparently routes `/api/v1/*` requests to the remote backend, mitigating CORS friction. |
| **Backend API** | Node.js, Express.js | Render Cloud Container | Validates parameters, executes filtering/sorting, serves authentic NASA mission seeds. |
| **Data Layer** | In-Memory Immutable Data Store (`seedStore.js`) | Node.js Process Heap | Pre-indexes NASA mission catalogs into $O(1)$ lookup maps for microsecond-level latency. |

---

## 2. Backend Architecture: Service-Oriented Layering

The backend is structured into clear separation of concerns:

```
server/src/
├── config/
│   └── env.js                 # Centralized environment variables & defaults
├── controllers/               # Thin HTTP handlers (parameter parsing & JSON responses)
│   ├── destinationController.js
│   ├── hardwareController.js
│   ├── quizController.js
│   ├── scienceController.js
│   ├── statusController.js
│   └── timelineController.js
├── data/                      # NASA mission seeds & memory cache
│   ├── seeds/                 # Raw curated NASA datasets (JSON)
│   └── seedStore.js           # O(1) hash indexed memory store (Object.freeze)
├── middleware/                # Security, rate limiting & error handlers
│   ├── asyncHandler.js        # Generic async promise wrapper
│   ├── errorHandler.js        # Centralized HTTP error formatter
│   └── rateLimiter.js         # express-rate-limit 100 req/15min guard
├── routes/                    # Express Router definitions
│   ├── destinationRoutes.js
│   ├── hardwareRoutes.js
│   ├── quizRoutes.js
│   ├── scienceRoutes.js
│   ├── statusRoutes.js
│   └── timelineRoutes.js
├── services/                  # Pure business logic & query filtering
│   ├── destinationService.js
│   ├── hardwareService.js
│   ├── quizService.js
│   ├── scienceService.js
│   ├── statusService.js
│   └── timelineService.js
├── app.js                     # Express app setup, CORS, Helmet, and routing
└── server.js                  # Process entry point & port binding
```

### Key Backend Patterns

1. **In-Memory Store (`seedStore.js`)**:
   - Replaced synchronous disk I/O (`fs.readFileSync`) with pre-parsed, in-memory frozen data structures.
   - Generates $O(1)$ lookup maps (`destMap`, `destBySlug`, `hwBySlug`, `quizBySlug`, `simBySlug`, `sciBySlug`).
   - Reduced endpoint response latency from 15–25ms to **0.4–1.8ms** (~15× throughput boost).
2. **Controller-Service Decoupling**:
   - Controllers handle HTTP transport concerns (extracting query/route parameters, status codes).
   - Services execute pure domain algorithms (multi-criteria hardware filtering, date sorting, decade grouping).
3. **Security & Resilience**:
   - **Helmet**: Configures protective HTTP headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`).
   - **Rate Limiting**: `express-rate-limit` caps standard traffic at 100 requests per 15-minute window per IP.
   - **CORS Hardening**: Strict origin whitelisting allowing authorized local and deployed frontends.

---

## 3. Frontend Architecture: State, Hooks & Decoupling

The frontend adheres to strict separation between presentational UI components and business logic:

```
client/src/
├── components/
│   ├── 3d/                    # Three.js / React Three Fiber canvas & celestial meshes
│   ├── academy/               # Space Academy quiz engine, simulator, certificate
│   ├── common/                # Reusable UI primitives (Navbar, Footer, ErrorBanner, SearchInput)
│   ├── hardware/              # Hardware detail sections (Hero, Instruments, Timeline)
│   └── timeline/              # Historical decade navigator & milestone stream
├── config/
│   └── appConfig.js           # Centralized client configuration & storage keys
├── context/
│   └── CadetContext.jsx       # Global Space Academy state (points, badges, streaks)
├── data/
│   └── defaultDestinations.js # Offline ephemeris fallback data
├── hooks/                     # Custom domain hooks (business logic extraction)
│   ├── useCadet.js            # Consumer hook for CadetContext
│   ├── useHardwareCatalog.js  # Hardware filtering, search, sorting & URL sync
│   ├── useSolarSystemNavigation.js # 3D navigation, destination selection & fallbacks
│   └── useTimelineMilestones.js    # Chronological milestones, decade counts & URL sync
├── pages/                     # Top-level route views (lazy-loaded)
├── services/
│   └── api.js                 # Unified API client with in-flight deduplication
└── utils/                     # Pure mathematical, formatting & date utilities
    ├── dateUtils.js           # YYYY-MM-DD parsing, calendar formatting, decade extraction
    └── formatters.js          # Number humanization and enum display formatting
```

### Key Frontend Patterns

1. **Global State via `CadetContext`**:
   - Centralizes Space Academy gamification: points, streak counter, completed quizzes, and awarded badges.
   - Syncs automatically to `localStorage` under `APP_CONFIG.storageKeys.cadetProgression`.
2. **Business Logic Extraction via Custom Hooks**:
   - UI components remain strictly declarative; all state, effects, API queries, and URL synchronization reside in dedicated hooks (`useHardwareCatalog`, `useTimelineMilestones`, `useSolarSystemNavigation`).
3. **In-Flight Request Deduplication (`api.js`)**:
   - Uses an in-memory `Map` to detect identical pending network requests. If multiple components request `/destinations` simultaneously, only one network request is dispatched across the wire.
4. **Accessible Error Handling (`ErrorBanner`)**:
   - Accessible error states with WAI-ARIA alert roles and retry capabilities across all major catalog and telemetry pages.

---

## 4. 3D WebGL & Three.js Optimization

The interactive Solar System navigator balances visual fidelity with mobile performance:

- **Clamped Device Pixel Ratio**: `dpr={Math.min(window.devicePixelRatio, 1.75)}` prevents thermal throttling and 60 FPS frame drops on high-density Retina and 4K displays.
- **Deterministic Geometry Disposal**: Custom cleanup hooks dispose of Three.js geometries, materials, and textures upon component unmounting to prevent WebGL context leaks.
- **Offline Ephemeris Fallback**: If backend network requests fail or lag, `defaultDestinations.js` provides instant offline coordinates and orbital characteristics.

---

## 5. Accessibility & WCAG 2.1 AA Compliance

Beyond Earth is engineered for inclusive accessibility:

- **Color Contrast**: All core text and interactive elements achieve a contrast ratio $\ge 4.5:1$ against deep-space backgrounds (up to 20:1 for primary headings).
- **Keyboard Navigation**:
  - Global "Skip to main content" link for screen reader and keyboard-only users.
  - Visible focus rings with high-contrast violet glow (`.focus-ring`).
- **WAI-ARIA Dialog Semantics**: Modals (Event Detail Dossier, Printable Certificate) implement `role="dialog"`, `aria-modal="true"`, focus traps, and Escape key dismissal.
- **Reduced Motion Support**:
  - `prefers-reduced-motion` media queries disable smooth scrolling animations and pause rotating 3D planetary orbits.
  - Flagship carousel features WCAG 2.2.2 Pause/Play toggle and hover-focus pause controls.

---

## 6. Verification & Automated Test Suites

The repository includes a comprehensive 3-stage validation suite:

```bash
npm test
```

1. **Phase 8 Validation Suite (`test_phase8_validation.js`)**:
   - Verifies 0 occurrences of unsafe `dangerouslySetInnerHTML`, `innerHTML`, or `eval()`.
   - Validates keyboard focus rings, ARIA landmarks, modal dialog roles, and WCAG contrast ratios.
   - Verifies route-level code splitting (19 lazy-loaded production chunks).
2. **API Contract Regression Suite (`tests/api_contract.test.mjs`)**:
   - Executes 27 live HTTP requests against all `/api/v1/*` endpoints.
   - Verifies response structures, status codes, query filtering, and 404 fallbacks.
3. **NASA Scientific Data & Seed Integrity (`tests/seed_integrity.test.mjs`)**:
   - Validates all 18 NASA hardware records against authentic NSSDCA Master Catalog IDs.
   - Ensures valid primary source NASA/JPL URLs and ISO 8601 calendar dates.
   - Checks all 6 Academy quizzes (24 questions) and 4 mission simulations for deterministic correctness.

---

## 7. Scalable API Reference

All backend endpoints are prefixed with `/api/v1`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System health check and uptime. |
| `GET` | `/destinations` | All 13 celestial bodies enriched with resident hardware counts. |
| `GET` | `/destinations/:slug` | Specific destination details with embedded hardware catalog. |
| `GET` | `/hardware` | Spacecraft catalog with filtering (`status`, `destination`, `category`, `search`, `sort`). |
| `GET` | `/hardware/:slug` | Deep mission dossier with instruments, telemetry, and citations. |
| `GET` | `/hardware/featured` | Flagship spacecraft selected for landing and spotlight showcases. |
| `GET` | `/timeline` | Six decades of chronological flight milestones (`era`, `major_only`, `sort`). |
| `GET` | `/science/concepts` | STEM explainers for key space technologies (RTG, DSN, lasers). |
| `GET` | `/science/discoveries` | Curated scientific breakthroughs aggregated by planetary domain. |
| `GET` | `/status/summary` | Real-time counts of operational vs resting spacecraft across the fleet. |
| `GET` | `/status/radar` | Comprehensive telemetry array for all 18 tracked missions. |
| `GET` | `/academy/quizzes` | Space Academy educational quizzes with difficulty filtering. |
| `GET` | `/academy/quizzes/:slug` | Full quiz questionnaire with educational explanations. |
| `GET` | `/academy/quizzes/simulations` | Interactive mission flight scenario decision trees. |
| `GET` | `/academy/quizzes/daily` | Deterministic daily flight challenge evaluated by date. |
