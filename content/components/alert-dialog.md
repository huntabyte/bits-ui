---
title: Alert Dialog
description: Presents critical information or prompts to the user, typically requiring their attention or action.
---

<script>
	import { APISection, ComponentPreview, AlertDialogDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="alert-dialog-demo" comp="AlertDialog">

<AlertDialogDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { AlertDialog } from "bits-ui";
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger />
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content>
			<AlertDialog.Title />
			<AlertDialog.Description />
			<AlertDialog.Cancel />
			<AlertDialog.Action />
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
```

## Controlled Usage

If you want to control or be aware of the `open` state of the dialog from outside of the component, you can bind to the `open` prop.

```svelte
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let dialogOpen = false;
</script>

<button on:click={() => (dialogOpen = true)}>Open Dialog</button>
<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Trigger />
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content>
			<AlertDialog.Title />
			<AlertDialog.Description />
			<AlertDialog.Cancel />
			<AlertDialog.Action />
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
