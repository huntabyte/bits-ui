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

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
