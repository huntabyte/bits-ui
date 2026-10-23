<script lang="ts">
	import { Pagination } from "bits-ui";
	let { count, page = 1 }: { count: number; page?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<Pagination.Root count={1000} perPage={10} {page}>
		{#snippet children({ pages })}
			<Pagination.PrevButton>prev</Pagination.PrevButton>
			{#each pages as p (p.key)}
				{#if p.type === "page"}
					<Pagination.Page page={p}>{p.value}</Pagination.Page>
				{:else}
					<span>…</span>
				{/if}
			{/each}
			<Pagination.NextButton>next</Pagination.NextButton>
		{/snippet}
	</Pagination.Root>
{/each}
