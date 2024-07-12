---
title: Dropdown Menu
description: Displays a menu of items that users can select from when triggered.
---

<script>
	import { APISection, ComponentPreviewV2, DropdownMenuDemo } from '$lib/components'
	export let schemas;
</script>

<ComponentPreviewV2 name="dropdown-menu-demo" comp="DropdownMenu">

{#snippet preview()}
<DropdownMenuDemo />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
