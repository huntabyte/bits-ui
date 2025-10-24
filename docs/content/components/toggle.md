---
title: Toggle
description: A toggle control that allows users to switch between two states.
---

<script>
	import { APISection, ComponentPreview, ToggleDemo } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreview name="toggle-demo" componentName="Toggle" variant="preview">

{#snippet preview()}
<ToggleDemo />
{/snippet}

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
</script>

<Toggle.Root />
```

## Managing Pressed State

This section covers how to manage the `pressed` state of the component.

### Two-Way Binding

Use `bind:pressed` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let myPressed = $state(true);
</script>

<button onclick={() => (myPressed = false)}> un-press </button>

<Toggle.Root bind:pressed={myPressed} />
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Toggle } from "bits-ui";
  let myPressed = $state(false);

  function getPressed() {
    return myPressed;
  }

  function setPressed(newPressed: boolean) {
    myPressed = newPressed;
  }
</script>

<Toggle.Root bind:pressed={getPressed, setPressed}>
  <!-- ... -->
</Toggle.Root>
```

<APISection {schemas} />
