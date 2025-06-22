---
title: Pagination
description: Facilitates navigation between pages.
---

<script>
	import { APISection, ComponentPreviewV2, PaginationDemo, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="pagination-demo" componentName="Pagination">

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

## Managing Page State

This section covers how to manage the `page` state of the component.

### Two-Way Binding

Use `bind:page` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Pagination } from "bits-ui";
  let myPage = $state(1);
</script>

<button onclick={() => (myPage = 2)}> Go to page 2 </button>

<Pagination.Root bind:page={myPage}>
  <!-- ...-->
</Pagination.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Pagination } from "bits-ui";
  let myPage = $state(1);

  function getPage() {
    return myPage;
  }

  function setPage(newPage: number) {
    myPage = newPage;
  }
</script>

<Pagination.Root bind:page={getPage, setPage}>
  <!-- ... -->
</Pagination.Root>
```

## Ellipsis

The `pages` snippet prop consists of two types of items: `'page'` and `'ellipsis'`. The `'page'` type represents an actual page number, while the `'ellipsis'` type represents a placeholder for rendering an ellipsis between pages.

<APISection {schemas} />
