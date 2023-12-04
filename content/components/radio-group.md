---
title: Radio Group
description: Allows users to select a single option from a list of mutually exclusive choices.
---

<script>
	import { APISection, ComponentPreview, RadioGroupDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="radio-group-demo" comp="RadioGroup">

<RadioGroupDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { RadioGroup } from "bits-ui";
</script>

<RadioGroup.Root>
	<RadioGroup.Item>
		<RadioGroup.ItemIndicator />
	</RadioGroup.Item>
</RadioGroup.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
