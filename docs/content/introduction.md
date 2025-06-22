---
title: Introduction
description: The headless components for Svelte.
---

Bits UI is a headless component library for Svelte focused on developer experience, accessibility, and full creative control. Use it to build high-quality, accessible UIs without giving up styling freedom or performance.

<a href="/docs/getting-started"><img src="/img/learn.png" alt='A webpage promoting learning to build custom components. The left side has a dark background with the text "Documentation" at the top, and a large heading "Learn how to build own components" with a "Get started" button below. The right side shows a stylized mobile app interface with a dark gray background. Inside the app is a light pink card displaying "Total distance" and "312 km". Below this are bar graphs for "Mon" to "Sun", with activity shown for Monday through Thursday and dotted outlines for Friday through Sunday. At the bottom of the card is a horizontal slider with a circle indicating a selection. A small, dark purple label with "Dev" written on it points to this slider.' class="h-full w-full mt-6 rounded-xl md:rounded-2xl border" /></a>

## Why Bits UI?

<img src="/img/bring-own-style.png" alt="Switch customization UI: Edit toggle style, color, and theme using Tailwind or CSS tools." class="h-full w-full mt-6 -mb-6 rounded-xl md:rounded-2xl" />

### Bring Your Own Styles

Most components ship completely unstyled, with the exception of those required for core functionality. No CSS resets, no design system assumptions. You bring the styles using standard `class` props or `data-*` attributes. [See the styling guide](/docs/styling).

<img src="/img/developer-exp.png" alt="Accordion builder UI: Easily compose accessible accordion components with Bits UI." class="h-full w-full mt-16 -mb-6 rounded-xl md:rounded-2xl border" />

### Building for Developer Experience

Everything is designed to stay out of your way:

- Full TypeScript coverage
- Stable, predictable APIs
- Flexible event override system
- Great defaults, easily overridden
- Comprehensive documentation and examples

<img src="/img/accessibility.png" alt="Production-Ready Accessibility" class="h-full w-full mt-16 -mb-6 rounded-xl md:rounded-2xl border" />

### Production-Ready Accessibility

Accessibility isn't just an afterthought - it's baked in:

- WAI-ARIA compliance
- Keyboard navigation by default
- Focus management handled for you
- Screen reader support built-in

<img src="/img/composable2.png" alt="Composable by Design" class="h-full w-full mt-16 -mb-6 rounded-xl md:rounded-2xl border" />

### Composable by Design

Components are primitives, not black boxes. They compose cleanly and play well together:

- [Render Delegation](/docs/child-snippet) for total flexibility
- Chainable events and callbacks
- Override-friendly defaults
- Minimal dependencies

## Community

Bits UI was built and is maintained by [Hunter Johnston](https://x.com/huntabyte) with design support from [Pavel Stianko](https://x.com/pavel_stianko) and his team at [Bitworks Studio](https://bitworks.cz) and tooling support from [Adrian Gonz](https://github.com/AdrianGonz97). Contributions, issues, and feedback are always welcome.

Found an issue? [Open one](https://github.com/huntabyte/bits-ui/issues/new).
Have a feature request? [Let's discuss](https://github.com/huntabyte/bits-ui/discussions/new?category=feature-requests-ideas)

## Acknowledgments

Built on the shoulders of giants:

- [Melt UI](https://melt-ui.com) - inspired the internal architecture
- [Radix UI](https://radix-ui.com) - API design inspiration
- [React Spectrum](https://react-spectrum.adobe.com) - inspiration for the date/time components and excellence in accessibility
