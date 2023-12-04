---
title: Dialog
description: A modal window presenting content or seeking user input without navigating away from the current context.
---

<script>
	import { APISection, ComponentPreview, DialogDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="dialog-demo" comp="Dialog">

<DialogDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Dialog } from "bits-ui";
</script>

<Dialog.Root>
	<Dialog.Trigger />
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title />
			<Dialog.Description />
			<Dialog.Close />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
```

## Controlled Usage

If you want to control or be aware of the `open` state of the dialog from outside of the component, you can bind to the `open` prop.

```svelte
<script lang="ts">
	import { Dialog } from "bits-ui";
	let dialogOpen = false;
</script>

<button on:click={() => (dialogOpen = true)}>Open Dialog</button>
<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger />
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title />
			<Dialog.Description />
			<Dialog.Close />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
