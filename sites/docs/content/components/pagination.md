---
title: Pagination
description: Facilitates navigation between pages.
---

<script>
	import { APISection, ComponentPreviewV2, PaginationDemo } from '$lib/components/index.js'
	export let schemas
</script>

<ComponentPreviewV2 name="pagination-demo" comp="Pagination">

{#snippet preview()}
<PaginationDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Pagination } from "bits-ui";
</script>

<Pagination.Root let:pages>
	<Pagination.PrevButton />
	{#each pages as page (page.key)}
		<Pagination.Page {page} />
	{/each}
	<Pagination.NextButton />
</Pagination.Root>
```

<APISection {schemas} />
