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

## Reusable Components

You can create your own reusable components that combine the `Avatar` primitives and simplify the usage throughout your application. In the following example, we're creating a reusable `MyAvatar` component that takes in a `src` and `fallback` prop and renders an `Avatar.Root` component with an `Avatar.Image` and `Avatar.Fallback` component.

```svelte title="MyAvatar.svelte"
<script lang="ts">
	import { Avatar, type WithoutChildrenOrChild } from "bits-ui";

	let {
		src,
		fallback,
		...restProps
	}: WithoutChildrenOrChild<Avatar.RootProps> & {
		src: string;
		fallback: string;
	} = $props();
</script>

<Avatar.Root {...restProps}>
	<Avatar.Image {src} />
	<Avatar.Fallback>
		{fallback}
	</Avatar.Fallback>
</Avatar.Root>
```

You could then use the `MyAvatar` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyAvatar from "$lib/components/MyAvatar.svelte";
</script>

<MyAvatar src="https://github.com/huntabyte.png" fallback="HJ" />
```

<APISection {schemas} />
