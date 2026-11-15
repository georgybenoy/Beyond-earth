---
name: nasa-science-data-integrity
description: Maintain scientific accuracy, provenance and transparent operational-status claims.
---

# Nasa Science Data Integrity Skill

## Scope
Mission seed JSON, spacecraft, destinations, timeline, science explainers, status tracker and citations.

## Procedure
- Treat NASA, JPL, NSSDCA and PDS primary sources as preferred evidence.
- Record source title, URL, publisher, access/retrieval date and the specific claim supported.
- Distinguish mission phase, last contact, operational status, surface status and end-of-mission status.
- Never label a status as live telemetry unless a live authoritative feed is actually queried.
- Mark curated/static status as an archive snapshot with an as-of date.
- Validate dates, units, identifiers, destination slugs, instrument lists and cross-references.
- Do not silently overwrite uncertain or conflicting scientific claims; flag them for review.
- Preserve existing mission coverage and educational explanations.
- Add schema validation and cross-reference tests for JSON archives.

## Acceptance
Every changed scientific claim has traceable provenance; no unsupported real-time claims; seed data passes schema and relationship validation.
