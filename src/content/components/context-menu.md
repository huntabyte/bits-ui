---
title: Context Menu
description: Displays a menu at the pointer's position when the trigger is right-clicked or long-pressed.
---

## Anatomy

```svelte
<script lang="ts">
	import { ContextMenu } from "bits-ui";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger />

	<ContextMenu.Portal>
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
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
```
