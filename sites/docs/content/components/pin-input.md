---
title: PIN Input
description: Allows users to input a sequence of one-character alphanumeric inputs.
---

<script>
	import { APISection, ComponentPreview, PinInputDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreview name="pin-input-demo" comp="PinInput">

<PinInputDemo slot="preview" />

</ComponentPreview>

This component is derived from and would not have been possible without the work done by [Input OTP](https://github.com/guilhermerodz/input-otp) by [Guilherme Rodz](https://x.com/guilhermerodz).

## Structure

```svelte
<script lang="ts">
	import { PinInput } from "bits-ui";
</script>

<PinInput.Root maxlength={6}>
	{#snippet children({ cells })}
		{#each cells as cell}
			{cell.char !== null ? cell.char : ""}
		{/each}
	{/snippet}
</PinInput.Root>
```

<APISection {schemas} />
