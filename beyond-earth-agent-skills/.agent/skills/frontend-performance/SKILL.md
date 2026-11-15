---
name: frontend-performance
description: Optimize Beyond Earth's React and Vite frontend without removing features.
---

# Frontend Performance Skill

## Scope
React pages/components, routing, API client, Tailwind styling, Vite build and browser runtime.

## Procedure
- Map route and component dependencies before changing code.
- Preserve all routes, page content, interactions, responsive layouts and motion preferences.
- Profile before optimizing. Separate initial-route cost from route-specific cost.
- Use route-level and component-level lazy loading where it improves real user experience.
- Split vendor/3D code intentionally; avoid arbitrary chunk fragmentation.
- Use memoization only when profiling or stable expensive work justifies it.
- Prevent duplicate requests; use abort signals for stale requests and define explicit cache freshness.
- Add image dimensions, responsive sources, lazy loading and decoding hints where appropriate.
- Avoid layout shifts and expensive global re-renders.
- Keep loading, empty, offline, error and retry states.
- Preserve API payload contracts and existing fallback behavior.
- Validate production build and compare bundle composition before/after.

## Acceptance
No feature loss; no broken routes; no console errors; measurable performance improvement with before/after evidence.
