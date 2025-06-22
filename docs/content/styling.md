---
title: Styling
description: Learn how to style Bits UI components.
---

We ship almost zero styles with Bits UI by design, giving you complete flexibility when styling your components. For each component that renders an HTML element, we expose the `class` and `style` props to apply styles directly to the component.

## Styling Approaches

### CSS Frameworks

If you're using a CSS framework like [TailwindCSS](https://tailwindcss.com/) or [UnoCSS](https://unocss.dev), simply pass the classes to the component:

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>

<Accordion.Trigger class="h-12 w-full bg-blue-500 hover:bg-blue-600"
  >Click me</Accordion.Trigger
>
```

### Data Attributes

Each Bits UI component applies specific data attributes to its rendered elements. These attributes provide reliable selectors for styling across your application.

```css title="app.css"
/* Target all Accordion.Trigger components */
[data-accordion-trigger] {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: #fff;
}
```

Import your stylesheet in your layout component:

```svelte title="+layout.svelte"
<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

{@render children()}
```

Now every `Accordion.Trigger` component will have the styles applied to it.

### Global Classes

Alternatively, you can use global class names:

```css title="app.css"
.accordion-trigger {
  height: 3rem;
  width: 100%;
  background-color: #3182ce;
  color: #fff;
}
```

Import your stylesheet in your layout component:

```svelte title="+layout.svelte"
<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

{@render children()}
```

Use the global class with the component:

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>

<Accordion.Trigger class="accordion-trigger">Click me</Accordion.Trigger>
```

### Scoped Styles

To use Svelte's scoped styles, use the `child` snippet to bring the element into your component's scope. See the [Child Snippet](/docs/child-snippet) documentation for more information.

```svelte title="MyAccordionTrigger.svelte"
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>

<Accordion.Trigger>
  {#snippet child({ props })}
    <button {...props} class="my-accordion-trigger"> Click me! </button>
  {/snippet}
</Accordion.Trigger>

<style>
  .my-accordion-trigger {
    height: 3rem;
    width: 100%;
    background-color: #3182ce;
    color: #fff;
  }
</style>
```

### Style Prop

All Bits UI components that render an element accept a style prop as either a string or an object of CSS properties. These are merged with internal styles using the [`mergeProps`](/docs/utilities/merge-props) function.

```svelte
<!-- prettier-ignore -->
<Accordion.Trigger style="background-color: #3182ce; color: white; padding: 1rem;">
	Click me
</Accordion.Trigger>

<!-- Or using an object -->
<Accordion.Trigger
  style={{ backgroundColor: "#3182ce", color: "white", padding: "1rem" }}
>
  Click me
</Accordion.Trigger>
```

## Styling Component States

Bits UI components may expose state information through data attributes and CSS variables, allowing you to create dynamic styles based on component state.

### State Data Attributes

Components apply state-specific data attributes that you can target in your CSS:

```css
/* Style the Accordion.Trigger when open */
[data-accordion-trigger][data-state="open"] {
  background-color: #f0f0f0;
  font-weight: bold;
}

/* Style the Accordion.Trigger when closed */
[data-accordion-trigger][data-state="closed"] {
  background-color: #ffffff;
}

/* Style disabled components */
[data-accordion-trigger][data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

See each component's API reference for its specific data attributes.

### CSS Variables

Bits UI components may expose CSS variables that allow you to access internal component values. For example, to ensure the `Select.Content` is the same width as the anchor (by default is the `Select.Trigger` unless using a `customAnchor`), you can use the `--bits-select-anchor-width` CSS variable:

```css
[data-select-content] {
  width: var(--bits-select-anchor-width);
  min-width: var(--bits-select-anchor-width);
  max-width: var(--bits-select-anchor-width);
}
```

See each component's API reference for specific CSS variables it provides.

### Example: Styling an Accordion

Here's an example styling an accordion with different states:

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>

<Accordion.Root>
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content for section 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger disabled>Section 2 (Disabled)</Accordion.Trigger>
    <Accordion.Content>Content for section 2</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

<style>
  /* Base styles */
  :global([data-accordion-item]) {
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }

  /* Trigger styles based on state */
  :global([data-accordion-trigger]) {
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :global([data-accordion-trigger][data-state="open"]) {
    background-color: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  :global([data-accordion-trigger][data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Content styles */
  :global([data-accordion-content]) {
    padding: 1rem;
  }
</style>
```

## Advanced Styling Techniques

### Combining Data Attributes with CSS Variables

You can combine data attributes with CSS variables to create dynamic styles based on component state. Here's how to animate the accordion content using the `--bits-accordion-content-height` variable and the `data-state` attribute:

```css
/* Basic transition animation */
[data-accordion-content] {
  overflow: hidden;
  transition: height 300ms ease-out;
  height: 0;
}

[data-accordion-content][data-state="open"] {
  height: var(--bits-accordion-content-height);
}

[data-accordion-content][data-state="closed"] {
  height: 0;
}
```

### Custom Keyframe Animations

For more control, use keyframe animations with the CSS variables:

```css
/* Define keyframes for opening animation */
@keyframes accordionOpen {
  0% {
    height: 0;
    opacity: 0;
  }
  80% {
    height: var(--bits-accordion-content-height);
    opacity: 0.8;
  }
  100% {
    height: var(--bits-accordion-content-height);
    opacity: 1;
  }
}

/* Define keyframes for closing animation */
@keyframes accordionClose {
  0% {
    height: var(--bits-accordion-content-height);
    opacity: 1;
  }
  20% {
    height: var(--bits-accordion-content-height);
    opacity: 0.8;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

/* Apply animations based on state */
[data-accordion-content][data-state="open"] {
  animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

[data-accordion-content][data-state="closed"] {
  animation: accordionClose 300ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
}
```

### Example: Animated Accordion

Here's an example of an accordion with a custom transition:

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
</script>

<Accordion.Root type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content for section 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>Content for section 2</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

<style>
  /* Base styles */
  :global([data-accordion-item]) {
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
  }

  /* Trigger styles based on state */
  :global([data-accordion-trigger]) {
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :global([data-accordion-trigger][data-state="open"]) {
    background-color: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  /* Content styles */
  :global([data-accordion-content]) {
    overflow: hidden;
    transition: height 300ms ease-out;
  }

  /* Define keyframes for opening animation */
  @keyframes -global-accordionOpen {
    0% {
      height: 0;
      opacity: 0;
    }
    80% {
      height: var(--bits-accordion-content-height);
      opacity: 0.8;
    }
    100% {
      height: var(--bits-accordion-content-height);
      opacity: 1;
    }
  }

  /* Define keyframes for closing animation */
  @keyframes -global-accordionClose {
    0% {
      height: var(--bits-accordion-content-height);
      opacity: 1;
    }
    20% {
      height: var(--bits-accordion-content-height);
      opacity: 0.8;
    }
    100% {
      height: 0;
      opacity: 0;
    }
  }

  /* Apply animations based on state */
  :global([data-accordion-content][data-state="open"]) {
    animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  :global([data-accordion-content][data-state="closed"]) {
    animation: accordionClose 300ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
  }
</style>
```
