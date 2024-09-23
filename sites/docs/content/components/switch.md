---
title: Switch
description: A toggle control enabling users to switch between "on" and "off" states.
---

<script>
	import { APISection, ComponentPreviewV2, SwitchDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="switch-demo" comp="Switch">

{#snippet preview()}
<SwitchDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Switch } from "bits-ui";
</script>

<Switch.Root>
	<Switch.Thumb />
</Switch.Root>
```

## Reusable Components

It's recommended to use the `Switch` primitives to create your own custom switch component that can be used throughout your application.

In the example below, we're using the `Checkbox` and [`Label`](/docs/components/label) components to create a custom switch component.

```svelte title="MySwitch.svelte"
<script lang="ts">
	import { Switch, Label, type WithoutChildrenOrChild } from "bits-ui";

	type Props = WithoutChildrenOrChild<Switch.RootProps> & {
		labelText: string;
	};
</script>
```

<APISection {schemas} />
