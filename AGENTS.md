<!-- BEGIN:nextjs-agent-rules -->
# AGENTS.md

## Project

Portfolio and print store for a 3D artist, built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and pnpm.

The site should feel like an experimental digital portfolio with an integrated store, not a generic ecommerce template.

## Package Manager

Use `pnpm` for all dependency and script commands.

```bash
pnpm install
pnpm dev
pnpm build
pnpm add <package>
```

Do not use npm, yarn, or bun.

## Design Direction

The public portfolio should use custom, experimental Tailwind layouts:

* Irregular grids
* Oversized typography
* Layered media
* Asymmetric spacing
* Scroll-driven transitions
* Project-specific compositions

Prioritize artwork, typography, motion, atmosphere, and visual storytelling.

Avoid generic SaaS layouts, repetitive card grids, standard storefront sections, obvious Shopify-style templates, excessive rounded containers, and uniform project pages.

Each major project may have a distinct composition. Keep the underlying content model reusable without forcing every artwork into the same visual layout.

## UI Pro Max

UI Pro Max skills are installed and must be used for all meaningful UI design and implementation work.

Use them when creating:

* Page layouts and visual direction
* Responsive behavior
* Typography systems
* Motion and transitions
* Visual hierarchy
* Component styling
* Portfolio and product presentation

Do not ignore or bypass UI Pro Max during frontend design work.

## shadcn/ui

Use shadcn/ui for primitive interactive components where accessibility and behavior matter, including:

* Dialogs
* Sheets
* Menus
* Form controls
* Tabs
* Tooltips
* Checkout UI

Do not use shadcn/ui as the visual identity of the public portfolio. Restyle its components to match the custom design.

Use shadcn for behavior and Tailwind for identity.

## Motion and Transitions

Use a small, coherent animation stack.

### Motion

Use `motion` for regular interface animation:

* Element entrances and exits
* Hover and press states
* Menus and overlays
* Gallery and lightbox transitions
* Layout animations
* Shared-element transitions
* Small responsive interactions

### GSAP

Use `gsap` and ScrollTrigger only for signature, scroll-driven sections:

* Pinned artwork
* Scrubbed timelines
* Horizontal galleries
* Image sequences
* Typography transformations
* Complex parallax
* Scroll-controlled 3D models

Do not use GSAP for simple UI transitions that CSS or Motion can handle.

### Lenis

Add Lenis only when smooth scrolling materially improves a specific experience, such as a WebGL scene or a carefully choreographed scroll sequence.

The site must remain functional with native scrolling. Avoid sluggish or heavily dampened global scrolling.

### React Three Fiber

Use React Three Fiber only for deliberate 3D experiences. Do not add WebGL merely as decoration.

Keep 3D scenes isolated, lazy-loaded, responsive, and respectful of reduced-motion and lower-powered devices.

### CSS

Use CSS and Tailwind animations for small decorative effects and simple state changes.

## Motion Principles

Motion should support the artwork rather than compete with it.

Avoid applying the same fade-up animation to every section. Avoid constant parallax, excessive text splitting, cursor blobs, magnetic buttons everywhere, and animation for its own sake.

Prefer one or two memorable interactions per page. Give major projects motion behavior inspired by the artwork itself.

All animations must:

* Respect `prefers-reduced-motion`
* Avoid blocking navigation or content
* Remain usable on touch devices
* Avoid layout shifts
* Degrade gracefully when JavaScript or WebGL is unavailable

## Implementation

* Use Next.js App Router.
* Use Server Components by default.
* Add `"use client"` only where browser APIs or interaction require it.
* Keep client-side animation boundaries small.
* Prefer Tailwind utilities over separate CSS files.
* Use semantic HTML and accessible interaction patterns.
* Optimize images, videos, and 3D assets.
* Lazy-load expensive media and interactive scenes.
* Keep project pages indexable and meaningful without animation.
* Avoid adding dependencies when CSS, browser APIs, or existing components are sufficient.
* Do not build a custom component when a suitable shadcn primitive already handles the required accessibility and behavior.

## Initial Animation Dependencies

```bash
pnpm add motion gsap
```

Add Lenis and React Three Fiber only when required by an implemented design:

```bash
pnpm add lenis
pnpm add three @react-three/fiber @react-three/drei
```
<!-- END:nextjs-agent-rules -->
