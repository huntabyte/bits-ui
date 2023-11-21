---
title: Avatar
description: Displays images with a fallback option for failed loading, ensuring consistent visual representation.
---

<script>
	import { APISection, ComponentPreview, AvatarDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="avatar-demo" comp="Avatar">

<AvatarDemo slot="preview" />

</ComponentPreview>

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
