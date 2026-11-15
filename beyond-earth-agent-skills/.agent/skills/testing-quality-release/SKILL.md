---
name: testing-quality-release
description: Build a dependable test, CI and release process for the full-stack application.
---

# Testing Quality Release Skill

## Scope
Frontend, backend, seed data, API contracts, browser workflows, dependency audits and deployment.

## Procedure
- Establish baseline scripts for lint, unit tests, integration tests, build and audit.
- Use the project's current tooling where practical; avoid introducing overlapping test frameworks without need.
- Test API success, empty, invalid input, not found, server error, CORS and rate-limit behavior.
- Test frontend loading, error, offline fallback, filtering, sorting, navigation and key interactions.
- Add browser E2E tests for every major feature area, including the 3D fallback path.
- Validate seed JSON schemas, unique slugs, valid dates, source URLs and cross-file relationships.
- Add CI checks for install reproducibility, lint, tests, production build and dependency review.
- Pin or constrain runtime versions and keep lockfiles synchronized.
- Use staged rollouts and smoke tests after deployment.
- Report skipped tests and environmental limitations explicitly.

## Acceptance
A clean checkout can install, test and build reproducibly; critical user journeys have regression coverage; release evidence is recorded.
