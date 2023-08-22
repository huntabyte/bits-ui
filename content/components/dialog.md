---
title: Dialog
description: A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
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

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
