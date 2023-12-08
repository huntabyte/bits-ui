---
title: PIN Input
description: Allows users to input a sequence of one-character alphanumeric inputs.
---

<script>
	import { APISection, ComponentPreview, PinInputDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="pin-input-demo" comp="PinInput">

<PinInputDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { PinInput } from "bits-ui";
</script>

<PinInput.Root>
	<PinInput.Input />
	<PinInput.Input />
	<PinInput.Input />
	<PinInput.Input />
	<PinInput.HiddenInput />
</PinInput.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
