<script lang="ts">
	import { Pagination } from "$lib";
	import { CaretLeft, CaretRight, DotsThree } from "phosphor-svelte";
</script>

<Pagination.Root count={100} perPage={10} let:pages let:range>
	<p class="text-sm text-muted-foreground">
		Showing {range.start} - {range.end}
	</p>
	<div class="mt-4 flex items-center justify-center gap-1.5">
		<Pagination.PrevButton
			class="inline-flex items-center justify-center rounded-[9px] bg-transparent transition-all sq-10 hover:bg-foreground/5 active:scale-98 active:bg-dark-10 disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent"
		>
			<CaretLeft class="sq-6" />
		</Pagination.PrevButton>
		{#each pages as page (page.key)}
			{#if page.type === "ellipsis"}
				<div class="self-end">
					<DotsThree class="sq-5" weight="bold" />
				</div>
			{:else}
				<Pagination.Page
					{page}
					class="inline-flex items-center justify-center rounded-[9px] border border-border bg-background shadow-mini sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[selected]:bg-foreground data-[selected]:text-background"
				>
					{page.value}
				</Pagination.Page>
			{/if}
		{/each}
		<Pagination.NextButton
			class="inline-flex items-center justify-center rounded-[9px] bg-transparent transition-all sq-10 hover:bg-foreground/5 active:scale-98 active:bg-dark-10 disabled:cursor-not-allowed hover:disabled:bg-transparent"
		>
			<CaretRight class="sq-6" />
		</Pagination.NextButton>
	</div>
</Pagination.Root>
