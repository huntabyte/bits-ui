---
title: Toolbar
description: Displays frequently used actions or tools in a compact and easily accessible bar.
---

<script>
	import { APISection, ComponentPreview, ToolbarDemo } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreview name="toolbar-demo" componentName="Toolbar" variant="preview">

{#snippet preview()}
<ToolbarDemo slot="preview" />
{/snippet}

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
  import { Toolbar } from "bits-ui";
</script>

<Toolbar.Root>
  <Toolbar.Group>
    <Toolbar.GroupItem />
  </Toolbar.Group>
  <Toolbar.Link />
  <Toolbar.Button />
</Toolbar.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Toolbar } from "bits-ui";
  let myValue = $state("");
</script>

<button onclick={() => (myValue = "item-1")}> Press item 1 </button>

<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={myValue}>
    <!-- ... -->
  </Toolbar.Group>
</Toolbar.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Toolbar } from "bits-ui";
  let myValue = $state("");

  function getValue() {
    return myValue;
  }

  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>

<Toolbar.Root>
  <Toolbar.Group type="single" bind:value={getValue, setValue}>
    <!-- ... -->
  </Toolbar.Group>
</Toolbar.Root>
```

<APISection {schemas} />
