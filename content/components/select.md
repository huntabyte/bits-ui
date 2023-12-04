---
title: Select
description: Enables users to choose from a list of options presented in a dropdown.
---

<script>
	import { APISection, ComponentPreview, SelectDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="select-demo" comp="Select">

<SelectDemo slot="preview" />

</ComponentPreview>

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

🚧 **UNDER CONSTRUCTION** 🚧
