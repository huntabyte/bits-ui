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

## Page State

Bits UI provides flexible options for controlling and synchronizing the component's `page` state.

### Two-Way Binding

Use the `bind:page` directive for effortless two-way synchronization between your local state and the component's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Pagination } from "bits-ui";
	let myPage = $state(1);
</script>

<button onclick={() => (myPage = 10)}>Go to page 10</button>

<Pagination.Root bind:page={myPage}>
	<!-- ... -->
</Pagination.Root>
```

This setup enables changing the `page` via the custom button and ensures the local `myPage` state updates when the state updates through any internal means.

### Change Handler

You can also use the `onPageChange` prop to update local state when the component's `page` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the page changes.

```svelte {3,7-11}
<script lang="ts">
	import { Pagination } from "bits-ui";
	let myPage = $state(1);
</script>

<Pagination.Root
	page={myPage}
	onPageChange={(newPage) => {
		myPage = newPage;
		// additional logic here.
	}}
>
	<!-- ... -->
</Pagination.Root>
```

### Controlled

Sometimes, you may want complete control over the component's `page` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you'll rarely need this, it's possible to do so by setting the `controlledPage` prop to `true`.

You will then be responsible for updating a local state variable that is passed as the `page` prop to the `Pagination.Root` component.

```svelte
<script lang="ts">
	import { Pagination } from "bits-ui";

	let myPage = $state(1);
</script>

<Pagination.Root controlledPage page={myPage} onPageChange={(p) => (myPage = p)}>
	<!-- ... -->
</Pagination.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Ellipsis

The `pages` snippet prop consists of two types of items: `'page'` and `'ellipsis'`. The `'page'` type represents an actual page number, while the `'ellipsis'` type represents a placeholder for rendering an ellipsis between pages.

<APISection {schemas} />
