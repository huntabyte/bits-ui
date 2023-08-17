---
title: Select
description: Enable users to choose a single option from a dropdown menu that presents a list of selectable items.
---

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
