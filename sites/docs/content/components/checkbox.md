---
title: Checkbox
description: Allow users to switch between checked, unchecked, and indeterminate states.
---

<script>
	import { APISection, ComponentPreviewV2, CheckboxDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="checkbox-demo" comp="Checkbox">

{#snippet preview()}
<CheckboxDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Checkbox } from "bits-ui";
</script>

<Checkbox.Root>
	<Checkbox.Indicator />
	<Checkbox.Input />
</Checkbox.Root>
```

<APISection {schemas} />

## Examples

### Controlled Usage

If you want to control or be aware of the `checked` state from outside the component, you can bind to the `checked` prop.

```svelte showLineNumbers
<script lang="ts">
	import { Checkbox } from "bits-ui";
	let myChecked = false;
</script>

<p>Checked: {myChecked}</p>
<Checkbox.Root bind:checked={myChecked}>
	<Checkbox.Indicator />
	<Checkbox.Input />
</Checkbox.Root>
```
