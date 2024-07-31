---
title: Alert Dialog
description: A modal window that alerts users with important information and awaits their acknowledgment or action.
---

<script>
	import { APISection, ComponentPreviewV2, AlertDialogDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="alert-dialog-demo" comp="Alert Dialog">

{#snippet preview()}
<AlertDialogDemo />
{/snippet}

</ComponentPreviewV2>

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

## Usage

### Controlled Open

If you want to control or be aware of the `open` state of the dialog from outside of the component, bind to the `open` prop.

```svelte {3,6,8}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let open = $state(false);
</script>

<button onclick={() => (open = true)}>Open Dialog</button>

<AlertDialog.Root bind:open>
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
