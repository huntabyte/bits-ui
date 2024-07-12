---
title: Context Menu
description: Displays options or actions relevant to a specific context or selected item, triggered by a right-click.
---

<script>
	import { APISection, ComponentPreviewV2, ContextMenuDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="context-menu-demo" comp="ContextMenu">

{#snippet preview()}
<ContextMenuDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { ContextMenu } from "bits-ui";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger />

	<ContextMenu.Content>
		<ContextMenu.Label />
		<ContextMenu.Item />

		<ContextMenu.Group>
			<ContextMenu.Item />
		</ContextMenu.Group>

		<ContextMenu.CheckboxItem>
			<ContextMenu.CheckboxIndicator />
		</ContextMenu.CheckboxItem>

		<ContextMenu.RadioGroup>
			<ContextMenu.RadioItem>
				<ContextMenu.RadioIndicator />
			</ContextMenu.RadioItem>
		</ContextMenu.RadioGroup>

		<ContextMenu.Sub>
			<ContextMenu.SubTrigger />
			<ContextMenu.SubContent />
		</ContextMenu.Sub>

		<ContextMenu.Separator />
		<ContextMenu.Arrow />
	</ContextMenu.Content>
</ContextMenu.Root>
```

<APISection {schemas} />
