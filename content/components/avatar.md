---
title: Avatar
description: Represents a user or entity with a recognizable image or placeholder in UI elements.
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
