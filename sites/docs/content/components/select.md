---
title: Select
description: Enables users to choose from a list of options presented in a dropdown.
---

<script>
	import { APISection, ComponentPreviewV2, SelectDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="select-demo" comp="Select">

{#snippet preview()}
<SelectDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Select } from "bits-ui";
</script>

<Select.Root>
	<Select.Trigger>
		<Select.Value />
	</Select.Trigger>

	<Select.Content>
		<Select.Item>
			<Select.ItemIndicator />
		</Select.Item>

		<Select.Group>
			<Select.Label />
			<Select.Item>
				<Select.ItemIndicator />
			</Select.Item>
		</Select.Group>

		<Select.Arrow />
	</Select.Content>
</Select.Root>
```

<APISection {schemas} />
