---
title: Radio Group
description: Allows users to select a single option from a list of mutually exclusive choices.
---

<script>
	import { APISection, ComponentPreviewV2, RadioGroupDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="radio-group-demo" comp="RadioGroup">

{#snippet preview()}
<RadioGroupDemo />
{/snippet}

</ComponentPreviewV2>

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
