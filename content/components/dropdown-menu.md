---
title: Dropdown Menu
description: Displays a menu of items that users can select from when triggered.
---

<script>
	import { APISection, ComponentPreview, DropdownMenuDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="dropdown-menu-demo" comp="DropdownMenu">

<DropdownMenuDemo slot="preview" />

</ComponentPreview>

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
