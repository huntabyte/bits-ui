---
title: Rating Group
description: Allows users to provide ratings using customizable items (like stars).
---

<script>
	import { APISection, ComponentPreviewV2, RatingGroupDemo, RatingGroupDemoCustom, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="rating-group-demo" componentName="Rating Group">

{#snippet preview()}
<RatingGroupDemo />
{/snippet}

</ComponentPreviewV2>

<ComponentPreviewV2 name="rating-group-demo-custom" componentName="Rating Group">

{#snippet preview()}
<RatingGroupDemoCustom />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
