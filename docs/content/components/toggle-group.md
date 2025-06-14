---
title: Toggle Group
description: Groups multiple toggle controls, allowing users to enable one or multiple options.
---

<script>
	import { APISection, ComponentPreviewV2, ToggleGroupDemo } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="toggle-group-demo" componentName="ToggleGroup">

{#snippet preview()}
<ToggleGroupDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
</script>

<ToggleGroup.Root>
  <ToggleGroup.Item value="bold">bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">italic</ToggleGroup.Item>
</ToggleGroup.Root>
```

## Single & Multiple

The `ToggleGroup` component supports two `type` props, `'single'` and `'multiple'`. When the `type` is set to `'single'`, the `ToggleGroup` will only allow a single item to be selected at a time, and the type of the `value` prop will be a string.

When the `type` is set to `'multiple'`, the `ToggleGroup` will allow multiple items to be selected at a time, and the type of the `value` prop will be an array of strings.

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  let myValue = $state("");
</script>

<button onclick={() => (myValue = "item-1")}> Press item 1 </button>

<ToggleGroup.Root type="single" bind:value={myValue}>
  <!-- -->
</ToggleGroup.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { ToggleGroup } from "bits-ui";
  let myValue = $state("");

  function getValue() {
    return myValue;
  }

  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>

<ToggleGroup.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</ToggleGroup.Root>
```

<APISection {schemas} />
