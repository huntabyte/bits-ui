<script lang="ts">
	import { RangeMonthCalendar } from "bits-ui";

	function cn(str: string) {
		return str;
	}

	let { value = $bindable() } = $props();
</script>

<RangeMonthCalendar.Root
	bind:value
	class="rounded-15px border-dark-10 bg-background-alt shadow-card mt-6 border p-[22px]"
	monthFormat="short"
	numberOfYears={2}
	minMonths={3}
	maxMonths={10}
>
	{#snippet children({ years })}
		<RangeMonthCalendar.Header class="flex items-center justify-between">
			<RangeMonthCalendar.PrevButton
				class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
			>
				←
			</RangeMonthCalendar.PrevButton>
			<RangeMonthCalendar.Heading class="text-[15px] font-medium" />
			<RangeMonthCalendar.NextButton
				class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
			>
				→
			</RangeMonthCalendar.NextButton>
		</RangeMonthCalendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
			{#each years as year (year.value.year)}
				<RangeMonthCalendar.Grid class="w-full border-collapse select-none space-y-1">
					<RangeMonthCalendar.GridBody>
						{#each year.months as months, i (i)}
							<RangeMonthCalendar.GridRow class="flex w-full">
								{#each months as { value, label }, d (d)}
									<RangeMonthCalendar.Cell
										month={value}
										year={year.value}
										class="p-0! relative m-0 size-10 text-center text-sm focus-within:z-20"
									>
										<RangeMonthCalendar.Day
											class={cn(
												"rounded-9px text-foreground hover:border-foreground focus-visible:ring-foreground! data-selection-end:rounded-9px data-selection-start:rounded-9px data-highlighted:bg-muted data-selected:bg-muted data-selection-end:bg-foreground data-selection-start:bg-foreground data-disabled:text-foreground/30 data-selected:text-foreground data-selection-end:text-background data-selection-start:text-background data-unavailable:text-muted-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-disabled:pointer-events-none data-highlighted:rounded-none data-outside-month:pointer-events-none data-selected:font-medium data-selection-end:font-medium data-selection-start:font-medium data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0! group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
											)}
										>
											<div
												class="bg-foreground group-data-selected:bg-background group-data-is-this-month:block absolute top-[5px] hidden size-1 rounded-full"
											></div>
											{label}
										</RangeMonthCalendar.Day>
									</RangeMonthCalendar.Cell>
								{/each}
							</RangeMonthCalendar.GridRow>
						{/each}
					</RangeMonthCalendar.GridBody>
				</RangeMonthCalendar.Grid>
			{/each}
		</div>
	{/snippet}
</RangeMonthCalendar.Root>
