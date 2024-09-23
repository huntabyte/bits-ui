---
title: Command
description: A command menu component that can be used to search, filter, and select items.
---

<script>
	import { APISection, ComponentPreviewV2, CommandDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="command-demo" comp="Command">

{#snippet preview()}
<CommandDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
</script>

<Command.Root>
	<Combobox.Input />
	<Command.List>
		<Command.Viewport>
			<Command.Empty />
			<Command.Loading />
			<Command.Group>
				<Command.GroupHeading />
				<Command.GroupItems>
					<Command.Item />
					<Command.LinkItem />
				</Command.GroupItems>
			</Command.Group>
			<Command.Separator />
			<Command.Item />
			<Command.LinkItem />
		</Command.Viewport>
	</Command.List>
</Command.Root>
```

<APISection {schemas} />
