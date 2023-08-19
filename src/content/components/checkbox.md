---
title: Checkbox
description: Allow users to mark options as checked, unchecked, or indeterminate, accommodating versatile states.
---

<script>
	import { APISection } from '@/components'
	export let schemas;
</script>

## Structure

```svelte
<script lang="ts">
	import { Checkbox } from "bits-ui";
</script>

<Checkbox.Root>
	<Checkbox.Indicator />
	<Checkbox.Input />
</Checkbox.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
