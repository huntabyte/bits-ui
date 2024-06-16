---
title: Navigation Menu
description: A list of links that allow users to navigate between pages of a website.
---

<script>
	import { APISection, ComponentPreview, NavigationMenuDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreview name="navigation-menu-demo" comp="Navigation Menu">

<NavigationMenuDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { NavigationMenu } from "bits-ui";
</script>
```
