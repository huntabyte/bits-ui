<script lang="ts">
	import { RangeCalendar } from "bits-ui";

	function cn(str: string) {
		return str;
	}

	let { value = $bindable() } = $props();
</script>

<RangeCalendar.Root
	bind:value
	class="rounded-15px border-dark-10 bg-background-alt shadow-card mt-6 border p-[22px]"
	weekdayFormat="short"
	fixedWeeks={true}
	numberOfMonths={2}
>
	{#snippet children({ months, weekdays })}
		<RangeCalendar.Header class="flex items-center justify-between">
			<RangeCalendar.PrevButton
				class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
			>
				←
			</RangeCalendar.PrevButton>
			<RangeCalendar.Heading class="text-[15px] font-medium" />
			<RangeCalendar.NextButton
				class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98]"
			>
				→
			</RangeCalendar.NextButton>
		</RangeCalendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
			{#each months as month (month.value.month)}
				<RangeCalendar.Grid class="w-full border-collapse select-none space-y-1">
					<RangeCalendar.GridHead>
						<RangeCalendar.GridRow class="mb-1 flex w-full justify-between">
							{#each weekdays as day (day)}
								<RangeCalendar.HeadCell
									class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
								>
									<div>{day.slice(0, 2)}</div>
								</RangeCalendar.HeadCell>
							{/each}
						</RangeCalendar.GridRow>
					</RangeCalendar.GridHead>
					<RangeCalendar.GridBody>
						{#each month.weeks as weekDates, i (i)}
							<RangeCalendar.GridRow class="flex w-full">
								{#each weekDates as date, d (d)}
									<RangeCalendar.Cell
										{date}
										month={month.value}
										class="p-0! relative m-0 size-10 text-center text-sm focus-within:z-20"
									>
										<RangeCalendar.Day
											class={cn(
												"rounded-9px text-foreground hover:border-foreground focus-visible:ring-foreground! data-selection-end:rounded-9px data-selection-start:rounded-9px data-highlighted:bg-muted data-selected:bg-muted data-selection-end:bg-foreground data-selection-start:bg-foreground data-disabled:text-foreground/30 data-selected:text-foreground data-selection-end:text-background data-selection-start:text-background data-unavailable:text-muted-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-disabled:pointer-events-none data-highlighted:rounded-none data-outside-month:pointer-events-none data-selected:font-medium data-selection-end:font-medium data-selection-start:font-medium data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0! group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
											)}
										>
											<div
												class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
											></div>
											{date.day}
										</RangeCalendar.Day>
									</RangeCalendar.Cell>
								{/each}
							</RangeCalendar.GridRow>
						{/each}
					</RangeCalendar.GridBody>
				</RangeCalendar.Grid>
			{/each}
		</div>
	{/snippet}
</RangeCalendar.Root>
