---
title: Menubar
description: Organizes and presents a collection of menu options or actions within a horizontal bar.
---

<script>
	import { APISection, ComponentPreview, MenubarDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="menubar-demo" comp="Menubar">

<MenubarDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Menubar } from "bits-ui";
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger />
		<Menubar.Content>
			<Menubar.Label />
			<Menubar.Item />

			<Menubar.Group>
				<Menubar.Item />
			</Menubar.Group>

			<Menubar.CheckboxItem>
				<Menubar.CheckboxIndicator />
			</Menubar.CheckboxItem>

			<Menubar.RadioGroup>
				<Menubar.RadioItem>
					<Menubar.RadioIndicator />
				<Menubar.RadioItem>
			</Menubar.RadioGroup>

			<Menubar.Sub>
				<Menubar.SubTrigger />
				<Menubar.SubContent />
			</Menubar.Sub>

			<Menubar.Separator />
			<Menubar.Arrow />
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
