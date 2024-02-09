---
title: Combobox
description: Enables users to pick from a list of options displayed in a dropdown.
---

<script>
	import { APISection, ComponentPreview, ComboboxDemo } from '@/components'
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
	<Combobox.Content>
		<Combobox.Input />
		<Combobox.Label />
	</Combobox.Content>

	<Combobox.Menu>
		<Combobox.Item>
			<Combobox.ItemIndicator />
		</Combobox.Item>
		<Combobox.Separator>
	</Combobox.Menu>
	<Combobox.Arrow />
	<Combobox.HiddenInput />
</Combobox.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
