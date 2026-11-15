# Beyond Earth — Definition of Done

A change is complete only when:

1. It preserves all existing pages, routes, features, content and interactions.
2. API contracts remain backward-compatible or have a documented versioned migration.
3. Scientific claims remain sourced and traceable.
4. Keyboard, screen-reader, reduced-motion and responsive behavior are checked.
5. Unit/integration/E2E tests are added or updated for affected behavior.
6. Lint and production build pass.
7. Dependency/security checks are reviewed.
8. Performance is measured where optimization is claimed.
9. No secrets or environment files are committed.
10. The PR describes changes, tests actually run, measured impact and known limitations.

Never claim a test, audit, benchmark or deployment check passed unless it was run and its result inspected.
