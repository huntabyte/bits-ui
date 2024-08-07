---
title: Aspect Ratio
description: Displays content while maintaining a specified aspect ratio, ensuring consistent visual proportions.
---

<script>
	import { APISection, ComponentPreviewV2, AspectRatioDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="aspect-ratio-demo" comp="Aspect Ratio">

{#snippet preview()}
<AspectRatioDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { AspectRatio } from "bits-ui";
</script>

<AspectRatio.Root />
```

## Reusable Component

If you plan on using a lot of `AspectRatio` components throughout your application, you can create a reusable component that combines the `AspectRatio.Root` and whatever other elements you'd like to render within it. In the following example, we're creating a reusable `MyAspectRatio` component that takes in a `src` prop and renders an `img` element with the `src` prop.

```svelte title="MyAspectRatio.svelte"
<script lang="ts">
	import { AspectRatio, type WithoutChildrenOrChild } from "bits-ui";
	import Image from "phosphor-svelte/lib/Image";

	let {
		src,
		...restProps
	}: WithoutChildrenOrChild<AspectRatio.RootProps> & {
		src: string;
	} = $props();
</script>

<AspectRatio.Root {...restProps}>
	<Image {src} alt="an abstract painting" />
</AspectRatio.Root>
```

You can then use the `MyAspectRatio` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyAspectRatio from "$lib/components/MyAspectRatio.svelte";
</script>

<MyAspectRatio src="https://example.com/image.jpg" ratio={4 / 3} />
```

## Custom Ratio

Use the `ratio` prop to set a custom aspect ratio for the image.

```svelte /ratio/
<AspectRatio.Root ratio={16 / 9}>
	<!-- ... -->
</AspectRatio.Root>
```

<APISection {schemas} />
