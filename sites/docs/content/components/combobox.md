---
title: Combobox
description: Enables users to pick from a list of options displayed in a dropdown.
---

<script>
	import { APISection, ComponentPreview, ComboboxDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreview name="combobox-demo" comp="combobox">

<ComboboxDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
</script>

<Combobox.Root>
	<Combobox.Input />
	<Combobox.Label />

	<Combobox.Content>
		<Combobox.Item>
			<Combobox.ItemIndicator />
		</Combobox.Item>
		<Combobox.Separator />
	</Combobox.Content>
	<Combobox.Arrow />
	<Combobox.HiddenInput />
</Combobox.Root>
```

<APISection {schemas} />
