<script lang="ts">
	import { Pagination } from "$lib/index.js";
	import { CaretLeft, CaretRight } from "phosphor-svelte";
</script>

<Pagination.Root count={100} perPage={10} let:pages let:range>
	<div class="mb-[55px] flex items-center">
		<Pagination.PrevButton
			class="mr-[25px] inline-flex items-center justify-center rounded-[9px] bg-transparent sq-10 hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
		>
			<CaretLeft class="sq-6" />
		</Pagination.PrevButton>
		<div class="flex items-center gap-2.5">
			{#each pages as page (page.key)}
				{#if page.type === "ellipsis"}
					<div class="text-[15px] font-medium text-foreground-alt">...</div>
				{:else}
					<Pagination.Page
						{page}
						class="inline-flex items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium sq-10 hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent data-[selected]:bg-foreground data-[selected]:text-background"
					>
						{page.value}
					</Pagination.Page>
				{/if}
			{/each}
		</div>
		<Pagination.NextButton
			class="ml-[29px] inline-flex items-center justify-center rounded-[9px] bg-transparent sq-10 hover:bg-dark-10 active:scale-98 disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
		>
			<CaretRight class="sq-6" />
		</Pagination.NextButton>
	</div>
	<p class="text-center text-[13px] text-muted-foreground">
		Showing {range.start} - {range.end}
	</p>
</Pagination.Root>
