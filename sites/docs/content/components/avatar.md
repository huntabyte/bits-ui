---
title: Avatar
description: Represents a user or entity with a recognizable image or placeholder in UI elements.
---

<script>
	import { APISection, ComponentPreviewV2, AvatarDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="avatar-demo" comp="Avatar">

{#snippet preview()}
<AvatarDemo />
{/snippet}

</ComponentPreviewV2>

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
