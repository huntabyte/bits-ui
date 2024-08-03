---
title: Introduction
description: The headless components for Svelte.
---

Bits UI is a collection of headless component primitives that enable you to build your own custom components. They are designed to prioritize accessibility and flexibility, enabling you to add your own styles and behaviors to the components.

## Features

### Unstyled

Most Bits UI components are unstyled by default, it's up to you to style them however you please. You can use the `class` prop to apply your own styles, or use the applied data attributes to target the components across your entire application. Check out the [styling](/docs/styling) section for more information.

### Customizable

Each component offers a wide range of props for customizing behavior to fit your needs. Events and callbacks are chainable, allowing you to override the default functionality of the component by simply cancelling the event.

### Accessible

Bits UI components have been designed following the [W3C ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.2/) with the goal of making them usable by as many people as possible. Keyboard navigation, screen reader support, and focus management are all built-in. If you notice an accessibility issue, please [raise an issue](https://github.com/huntabyte/bits-ui/issues/new) and we'll address it as soon as possible.

### Composable

Bits UI is built with composability in mind. Each component is designed to be used in isolation, but can be composed together to create more complex UIs. Providing flexibility in the form of [Delegation](/docs/delegation) and event overrides puts the power of bending the components to your will in your hands.

## About

Bits UI was built and is maintained by [Hunter Johnston (aka Huntabyte)](https://x.com/huntabyte). The documentation and example components were designed by [Pavel Stianko](https://x.com/pavel_stianko) and [Bitworks](https://bitworks.cz).

## Credits

-   [Melt UI](https://melt-ui.com) - The powerful builder API that inspired a lot of the internals of Bits UI.
-   [Radix UI](https://radix-ui.com) - The incredible headless component APIs that we've taken heavy inspiration and code references from to build Bits UI.
-   [React Spectrum](https://react-spectrum.adobe.com) - A world-class library of headless components, hooks, and utilities that we've taken inspiration from to build the various Date and Time components in Bits UI.
