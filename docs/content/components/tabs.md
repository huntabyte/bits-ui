---
title: Tabs
description: Organizes content into distinct sections, allowing users to switch between them.
---

<script>
	import { APISection, ComponentPreviewV2, TabsDemo, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="tabs-demo" componentName="Tabs">

{#snippet preview()}
<TabsDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
  import { Tabs } from "bits-ui";
</script>

<Tabs.Root>
  <Tabs.List>
    <Tabs.Trigger />
  </Tabs.List>
  <Tabs.Content />
</Tabs.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Tabs } from "bits-ui";
  let myValue = $state("");
</script>

<button onclick={() => (myValue = "tab-1")}> Activate tab 1 </button>

<Tabs.Root bind:value={myValue}>
  <!-- -->
</Tabs.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Tabs } from "bits-ui";
  let myValue = $state("");

  function getValue() {
    return myValue;
  }

  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>

<Tabs.Root bind:value={getValue, setValue}>
  <!-- ... -->
</Tabs.Root>
```

## Orientation

The `orientation` prop is used to determine the orientation of the `Tabs` component, which influences how keyboard navigation will work.

When the `orientation` is set to `'horizontal'`, the `ArrowLeft` and `ArrowRight` keys will move the focus to the previous and next tab, respectively. When the `orientation` is set to `'vertical'`, the `ArrowUp` and `ArrowDown` keys will move the focus to the previous and next tab, respectively.

```svelte
<Tabs.Root orientation="horizontal">
  <!-- ... -->
</Tabs.Root>

<Tabs.Root orientation="vertical">
  <!-- ... -->
</Tabs.Root>
```

## Activation Mode

By default, the `Tabs` component will automatically activate the tab associated with a trigger when that trigger is focused. This behavior can be disabled by setting the `activationMode` prop to `'manual'`.

When set to `'manual'`, the user will need to activate the tab by pressing the trigger.

```svelte /activationMode="manual"/
<Tabs.Root activationMode="manual">
  <!-- ... -->
</Tabs.Root>
```

<APISection {schemas} />
