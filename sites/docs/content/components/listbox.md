---
title: Listbox
description: A list of options that can be selected by the user.
---

<script>
	import { APISection, ComponentPreviewV2, ListboxDemo } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="listbox-demo" comp="Listbox">

{#snippet preview()}
<ListboxDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Listbox } from "bits-ui";
</script>

<Listbox.Root>
	<Listbox.Label />
	<Listbox.Content>
		<Listbox.Group>
			<Listbox.GroupLabel />
			<Listbox.Item />
		</Listbox.Group>
	</Listbox.Content>
</Listbox.Root>
```

<APISection {schemas} />
