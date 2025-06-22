---
title: Collapsible
description: Conceals or reveals content sections, enhancing space utilization and organization.
---

<script>
	import { APISection, ComponentPreviewV2, CollapsibleDemo, CollapsibleDemoTransitions, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="collapsible-demo" componentName="Collapsible">

{#snippet preview()}
<CollapsibleDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Collapsible component enables you to create expandable and collapsible content sections. It provides an efficient way to manage space and organize information in user interfaces, enabling users to show or hide content as needed.

## Key Features

- **Accessibility**: ARIA attributes for screen reader compatibility and keyboard navigation.
- **Transition Support**: CSS variables and data attributes for smooth transitions between states.
- **Flexible State Management**: Supports controlled and uncontrolled state, take control if needed.
- **Compound Component Structure**: Provides a set of sub-components that work together to create a fully-featured collapsible.

## Architecture

The Collapsible component is composed of a few sub-components, each with a specific role:

- **Root**: The parent container that manages the state and context for the collapsible functionality.
- **Trigger**: The interactive element (e.g., button) that toggles the expanded/collapsed state of the content.
- **Content**: The container for the content that will be shown or hidden based on the collapsible state.

## Structure

Here's an overview of how the Collapsible component is structured in code:

```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
</script>

<Collapsible.Root>
  <Collapsible.Trigger />
  <Collapsible.Content />
</Collapsible.Root>
```

## Reusable Components

It's recommended to use the `Collapsible` primitives to create your own custom collapsible component that can be used throughout your application.

```svelte title="MyCollapsible.svelte"
<script lang="ts">
  import { Collapsible, type WithoutChild } from "bits-ui";

  type Props = WithoutChild<Collapsible.RootProps> & {
    buttonText: string;
  };

  let {
    open = $bindable(false),
    ref = $bindable(null),
    buttonText,
    children,
    ...restProps
  }: Props = $props();
</script>

<Collapsible.Root bind:open bind:ref {...restProps}>
  <Collapsible.Trigger>{buttonText}</Collapsible.Trigger>
  <Collapsible.Content>
    {@render children?.()}
  </Collapsible.Content>
</Collapsible.Root>
```

You can then use the `MyCollapsible` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
  import MyCollapsible from "$lib/components/MyCollapsible.svelte";
</script>

<MyCollapsible buttonText="Open Collapsible"
  >Here is my collapsible content.</MyCollapsible
>
```

## Managing Open State

This section covers how to manage the `open` state of the Collapsible.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { Collapsible } from "bits-ui";
  let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Collapsible</button>

<Collapsible.Root bind:open={isOpen}>
  <!-- ... -->
</Collapsible.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  let myOpen = $state(false);

  function getOpen() {
    return myOpen;
  }

  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>

<Collapsible.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</Collapsible.Root>
```

## Svelte Transitions

The Collapsible component can be enhanced with Svelte's built-in transition effects or other animation libraries.

### Using `forceMount` and `child` Snippets

To apply Svelte transitions to Collapsible components, use the `forceMount` prop in combination with the `child` snippet. This approach gives you full control over the mounting behavior and animation of the `Collapsible.Content`.

```svelte /forceMount/ /transition:fade/ /transition:fly/
<script lang="ts">
  import { Collapsible } from "bits-ui";
  import { fade } from "svelte/transition";
</script>

<Collapsible.Root>
  <Collapsible.Trigger>Open</Collapsible.Trigger>
  <Collapsible.Content forceMount>
    {#snippet child({ props, open })}
      {#if open}
        <div {...props} transition:fade>
          <!-- ... -->
        </div>
      {/if}
    {/snippet}
  </Collapsible.Content>
</Collapsible.Root>
```

In this example:

- The `forceMount` prop ensures the content is always in the DOM.
- The `child` snippet provides access to the open state and component props.
- Svelte's `#if` block controls when the content is visible.
- Transition directive (`transition:fade`) apply the animations.

### Best Practices

For cleaner code and better maintainability, consider creating custom reusable components that encapsulate this transition logic.

```svelte title="MyCollapsibleContent.svelte"
<script lang="ts">
  import { Collapsible, type WithoutChildrenOrChild } from "bits-ui";
  import { fade } from "svelte/transition";
  import type { Snippet } from "svelte";

  let {
    ref = $bindable(null),
    duration = 200,
    children,
    ...restProps
  }: WithoutChildrenOrChild<Collapsible.ContentProps> & {
    duration?: number;
    children?: Snippet;
  } = $props();
</script>

<Collapsible.Content forceMount bind:ref {...restProps}>
  {#snippet child({ props, open })}
    {#if open}
      <div {...props} transition:fade={{ duration }}>
        {@render children?.()}
      </div>
    {/if}
  {/snippet}
</Collapsible.Content>
```

You can then use the `MyCollapsibleContent` component alongside the other `Collapsible` primitives throughout your application:

```svelte
<script lang="ts">
  import { Collapsible } from "bits-ui";
  import { MyCollapsibleContent } from "$lib/components";
</script>

<Collapsible.Root>
  <Collapsible.Trigger>Open</Collapsible.Trigger>
  <MyCollapsibleContent duration={300}>
    <!-- ... -->
  </MyCollapsibleContent>
</Collapsible.Root>
```

<APISection {schemas} />
