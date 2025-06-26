---
title: Getting Started
description: Learn how to get started using Bits in your app.
---

Welcome to Bits UI, a collection of headless component primitives for Svelte 5 that prioritizes developer experience, accessibility, and flexibility. This guide will help you quickly integrate Bits UI into your Svelte application.

## Installation

Install bits using your preferred package manager.

```bash
npm install bits-ui
```

## Basic Usage

After installation, you can import and use Bits UI components in your Svelte files. Here's a simple example using the [Accordion](/docs/components/accordion) component.

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>

<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Header>
      <Accordion.Trigger>Item 1 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      >This is the collapsible content for this section.</Accordion.Content
    >
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Header>
      <Accordion.Trigger>Item 2 Title</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      >This is the collapsible content for this section.</Accordion.Content
    >
  </Accordion.Item>
</Accordion.Root>
```

## Adding Styles

Bits UI components are headless by design, meaning they ship with minimal styling. This gives you complete control over the appearance of your components. Each component that renders an HTML element exposes a `class` prop and `style` prop that you can use to apply styles to the element.

### Styling with TailwindCSS or UnoCSS

If you're using a CSS framework like TailwindCSS or UnoCSS, you can pass the classes directly to the components:

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>

<Accordion.Root class="mx-auto w-full max-w-md">
  <Accordion.Item class="mb-2 rounded-md border border-gray-200">
    <Accordion.Header class="bg-gray-50 transition-colors hover:bg-gray-100">
      <Accordion.Trigger
        class="flex w-full items-center justify-between p-4 text-left font-medium"
      >
        <span>Tailwind-styled Accordion</span>
        <svg
          class="h-5 w-5 transform transition-transform"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content class="p-4 text-gray-700">
      This accordion is styled using Tailwind CSS classes.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Styling with Data Attributes

Each Bits UI component applies specific data attributes to the underlying HTML elements. You can use these attributes to target components in your global styles:

1. Check the API Reference for each component to determine its data attributes
2. Use those attributes in your CSS selectors

```svelte title="+layout.svelte"
<script lang="ts">
  import { Button } from "bits-ui";
  import "../app.css";
</script>

<Button.Root>Click me</Button.Root>
```

```css title="app.css"
[data-button-root] {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: white;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
}

[data-button-root]:hover {
  background-color: #2c5282;
}
```

With this approach, every `Button.Root` component will have these styles applied to it automatically.

## TypeScript Support

Bits UI is built with TypeScript and provides comprehensive type definitions. When using TypeScript, you'll get full type checking and autocompletion:

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";

  // TypeScript will validate these props
  const accordionMultipleProps: Accordion.RootProps = {
    type: "multiple",
    value: ["item-1"], // type error if value is not an array
  };

  const accordionSingleProps: Accordion.RootProps = {
    type: "single",
    value: "item-1", // type error if value is an array
  };
</script>
```

## Next Steps

Now that you have Bits UI installed and working, you can:

- Explore the [Component Documentation](/docs/components) to learn about all available components
- Learn about render delegation using the [Child Snippet](/docs/child-snippet) for maximum flexibility and customization
- Learn how Bits UI handles [State Management](/docs/state-management) and how you can take more control over your components

## Resources

If you have questions or need help, there are several ways to get support from the Bits UI community:

- For confirmed bugs, please [open an issue](https://github.com/huntabyte/bits-ui/issues) on GitHub.
- Have a question or need help? Join our [Discord community](https://discord.gg/fdXy3Sk8Gq) or [open a discussion](https://github.com/huntabyte/bits-ui/discussions/new) on GitHub to chat with other developers and the Bits UI team.
- Have a feature request or idea? [Open a discussion](https://github.com/huntabyte/bits-ui/discussions/new?category=feature-requests-ideas) on GitHub to share your thoughts. All feature requests start as discussions before formally being moved to issues.
