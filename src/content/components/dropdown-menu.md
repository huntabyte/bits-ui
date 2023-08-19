---
title: Dropdown Menu
description: Displays a menu to the user, which can consist of links or functions, triggered by a button.
---

<script>
	import { APISection } from '@/components'
	export let schemas
</script>

## Structure

```svelte
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger />

	<DropdownMenu.Content>
		<DropdownMenu.Label />
		<DropdownMenu.Item />

		<DropdownMenu.Group>
			<DropdownMenu.Item />
		</DropdownMenu.Group>

		<DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxIndicator />
		</DropdownMenu.CheckboxItem>

		<DropdownMenu.RadioGroup>
			<DropdownMenu.RadioItem>
				<DropdownMenu.RadioIndicator />
			</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>

		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger />
			<DropdownMenu.SubContent />
		</DropdownMenu.Sub>

		<DropdownMenu.Separator />
		<DropdownMenu.Arrow />
	</DropdownMenu.Content>
</DropdownMenu.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
