---
name: threejs-webgl-optimization
description: Optimize the interactive Three.js solar system while retaining visual fidelity and interactions.
---

# Threejs Webgl Optimization Skill

## Scope
Three.js, React Three Fiber, Drei, canvas textures, instancing, shaders, controls and 2D fallback.

## Procedure
- Measure CPU frame time, GPU frame time, draw calls, triangles, texture memory and context loss behavior.
- Preserve all planets, moons, spacecraft markers, orbital paths, labels, camera behavior and user interactions.
- Use instancing/batching for repeated geometry where material and interaction semantics permit.
- Reuse geometries, materials and textures; dispose resources deterministically on unmount.
- Avoid recreating vectors, geometries, materials and callbacks on every frame.
- Use demand/priority rendering only where it does not break animation or controls.
- Add adaptive DPR and quality tiers based on device capability, with user override and a high-quality mode.
- Keep procedural textures and offline fallbacks intact.
- Handle WebGL context loss and restore; retain the 2D orbital map as a fallback, not a replacement.
- Respect prefers-reduced-motion without removing access to the experience.

## Acceptance
Same feature set and navigation; lower measured resource use or improved frame stability on target devices; no leaks after mount/unmount cycles.
