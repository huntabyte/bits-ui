---
title: Avatar
description: Displays user or entity images with a fallback option for failed loading, ensuring consistent visual representation.
---

<script>
	import { APISection } from '@/components'
	export let schemas;
</script>

## Structure

```svelte
<script lang="ts">
	import { Avatar } from "bits-ui";
</script>

<Avatar.Root>
	<Avatar.Image />
	<Avatar.Fallback />
</Avatar.Root>
```

<APISection {schemas} />

🚧 **UNDER CONSTRUCTION** 🚧
