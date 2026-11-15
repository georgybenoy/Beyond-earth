---
name: backend-security-reliability
description: Harden the Express API, improve throughput and preserve existing API behavior.
---

# Backend Security Reliability Skill

## Scope
Express app, routes, controllers, middleware, configuration and JSON seed archives.

## Procedure
- Inspect middleware order, route contracts, error handling and deployment configuration.
- Add secure HTTP headers with a carefully tested Content Security Policy; do not break required assets or embeds.
- Restrict CORS to explicit trusted origins. Remove credential support if the API does not use cookies or credentialed requests.
- Apply rate limits appropriate to public read APIs and any expensive endpoints; configure proxy trust correctly for Render.
- Validate and bound query parameters, path parameters, sort fields, pagination and request body sizes.
- Replace repeated synchronous seed-file reads with startup-loaded, validated immutable data or a safe cache.
- Precompute lookup maps and aggregates when this preserves semantics.
- Keep errors structured and avoid leaking stack traces or filesystem details in production.
- Add request IDs, structured logs, graceful shutdown and readiness/liveness semantics where appropriate.
- Do not add a database or external service unless justified by a concrete requirement.

## Acceptance
Existing endpoints remain compatible; concurrent requests do not block on repeated disk reads; CORS/security tests pass; failure modes are explicit.
