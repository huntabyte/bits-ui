---
title: Checkbox
description: Allow users to switch between checked, unchecked, and indeterminate states.
---

<script>
	import { APISection, ComponentPreview, CheckboxDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="checkbox-demo" comp="Checkbox">

<CheckboxDemo slot="preview" />

</ComponentPreview>

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

## Controlled Usage

If you want to control or be aware of the `checked` state of the checkbox from outside of the component, you can bind to the `checked` prop.

```svelte
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

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
