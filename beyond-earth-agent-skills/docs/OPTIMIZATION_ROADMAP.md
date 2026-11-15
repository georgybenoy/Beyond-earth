# Beyond Earth — Feature-Preserving Optimization Roadmap

## Guiding principle
Improve implementation quality without removing or simplifying any existing user-facing capability.

## Phase 0 — Baseline and safeguards
- Confirm the deployed commit, branch, Node/npm versions and hosting configuration.
- Capture install/build/test/audit output and bundle analyzer baseline.
- Inventory routes, feature modules, API endpoints and seed records.
- Add feature-preservation regression tests before refactoring.

## Phase 1 — Security and backend reliability
- Patch verified dependency advisories and regenerate lockfiles.
- Configure Helmet and a tested CSP.
- Restrict CORS to explicit production and development origins.
- Add API rate limiting and request-size limits.
- Cache parsed JSON seed data at startup; precompute destination and mission lookup maps.
- Add schema validation and structured error handling.

## Phase 2 — Frontend and 3D performance
- Measure Core Web Vitals and route-specific bundle costs.
- Keep 3D engine code out of routes that do not need it.
- Profile Solar System Explorer GPU/CPU usage and memory lifecycle.
- Optimize resource reuse, texture caching, adaptive DPR and quality tiers.
- Improve image loading, request deduplication, abort behavior and cache freshness.

## Phase 3 — Accessibility and UX resilience
- Add carousel pause/play and pause-on-focus/hover.
- Audit dialogs, keyboard paths, reduced motion, contrast and mobile reflow.
- Improve offline, slow-network, API cold-start and WebGL-unavailable states.

## Phase 4 — Scientific integrity
- Validate mission and destination schemas and cross-references.
- Audit NASA/JPL/NSSDCA citations and dates.
- Clearly distinguish curated status snapshots from live telemetry.
- Keep all existing missions, instruments, timelines and learning material.

## Phase 5 — Automated quality and operations
- Add unit, integration and browser E2E tests.
- Add CI for lint, tests, builds, dependency review and seed validation.
- Add deployment smoke tests, health/readiness checks and actionable monitoring.
- Document rollback and incident procedures.

## Release gate
No release until all existing major feature journeys pass, API compatibility is checked, accessibility regressions are resolved, security checks are reviewed and production build succeeds.
