<script lang="ts">
	import { Pagination } from "bits-ui";
	import CaretLeft from "phosphor-svelte/lib/CaretLeft";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
</script>

<Pagination.Root count={100} perPage={10}>
	{#snippet children({ pages, range })}
		<div class="my-8 flex items-center">
			<Pagination.PrevButton
				class="hover:bg-dark-10 disabled:text-muted-foreground mr-[25px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent active:scale-[0.98] disabled:cursor-not-allowed hover:disabled:bg-transparent"
			>
				<CaretLeft class="size-6" />
			</Pagination.PrevButton>
			<div class="flex items-center gap-2.5">
				{#each pages as page (page.key)}
					{#if page.type === "ellipsis"}
						<div class="text-foreground-alt select-none text-[15px] font-medium">
							...
						</div>
					{:else}
						<Pagination.Page
							{page}
							class="hover:bg-dark-10 data-selected:bg-foreground data-selected:text-background inline-flex size-10 select-none items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent"
						>
							{page.value}
						</Pagination.Page>
					{/if}
				{/each}
			</div>
			<Pagination.NextButton
				class="hover:bg-dark-10 disabled:text-muted-foreground ml-[29px] inline-flex size-10 items-center justify-center rounded-[9px] bg-transparent active:scale-[0.98] disabled:cursor-not-allowed hover:disabled:bg-transparent"
			>
				<CaretRight class="size-6" />
			</Pagination.NextButton>
		</div>
		<p class="text-muted-foreground text-center text-[13px]">
			Showing {range.start} - {range.end}
		</p>
	{/snippet}
</Pagination.Root>
