<script lang="ts">
	import { Pagination } from "$lib";
	import { CaretLeft, CaretRight } from "phosphor-svelte";
</script>

<Pagination.Root count={100} perPage={10} let:pages let:range>
	<p class="text-sm text-muted-foreground">
		Showing {range.start} - {range.end}
	</p>
	<div class="mt-4 flex items-center justify-center gap-1.5">
		<Pagination.PrevButton
			class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 disabled:cursor-not-allowed disabled:bg-muted"
		>
			<CaretLeft class="sq-6" />
		</Pagination.PrevButton>
		{#each pages as page (page.key)}
			{#if page.type === "ellipsis"}
				<span>...</span>
			{:else}
				<Pagination.Page
					{page}
					class="inline-flex items-center justify-center rounded-[9px] bg-transparent transition-all sq-10 hover:bg-muted data-[selected]:bg-background"
				>
					{page.value}
				</Pagination.Page>
			{/if}
		{/each}
		<Pagination.NextButton
			class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted"
		>
			<CaretRight class="sq-6" />
		</Pagination.NextButton>
	</div>
</Pagination.Root>
