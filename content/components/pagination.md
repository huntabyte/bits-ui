---
title: Pagination
description: Facilitates navigation between pages.
---

<script>
	import { APISection, ComponentPreview, PaginationDemo } from '@/components'
	export let schemas
</script>

<ComponentPreview name="pagination-demo" comp="Pagination">

<PaginationDemo slot="preview" />

</ComponentPreview>

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
