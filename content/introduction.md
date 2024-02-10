---
title: Introduction
description: The headless components for Svelte.
---

Bits UI is a collection of headless component primitives that enable you to build your own custom components. They have been thoughtfully designed to prioritize simplicity without compromising customizability.

Under the hood, most of these components are powered by [Melt UI](https://melt-ui.com), which provides an even lower-level builder API for creating headless components. Bits takes that API and wrap it in a more familiar component interface, allowing us to handle some quality of life improvements for you.

## Unstyled

Bits UI components are unstyled by default. This means that they don't come with any styles out of the box. This is intentional, as it allows you to style them however you want. You can use the `class` prop to apply your own styles, or use the applied data attributes to target the components across your entire application. Check out the [styling](/styling) section for more information.

## Customizable

Each component has a wide range of props that allow you to customize the behavior of the component to fit your needs. Events are also dispatched for each interaction, allowing you to override the default functionality of the component.

## Accessible

A ton of effort has been invested in making sure that the components are accessible by default. They've been designed following the best practices for accessibility with the goal of making them usable by as many people as possible. Keyboard navigation, screen reader support, and focus management are all built-in.

## Consistent

The API of each component has been designed with consistency in mind. This means that once you learn how to use one component, you should be able to use similar components with ease. While the docs are always there to help, the goal is to make the components as intuitive as possible.

## Credits

- [Bitworks](https://bitworks.cz) - The design team behind the Bits UI documentation and example components.
- [Melt UI](https://melt-ui.com) - The underlying builder API that powers Bits.
- [Radix UI](https://radix-ui.com) - The incredible headless component APIs that we've taken heavy inspiration from.
- [React Spectrum](https://react-spectrum.adobe.com) - An incredible collection of headless components we've taken inspiration from.
