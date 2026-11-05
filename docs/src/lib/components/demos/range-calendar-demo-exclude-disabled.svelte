<script lang="ts">
	import { RangeCalendar } from "bits-ui";
	import CaretLeft from "phosphor-svelte/lib/CaretLeft";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import { cn } from "#lib/utils/styles.js";
	import type { ComponentProps } from "svelte";
	import { isWeekend } from "@internationalized/date";

	let { value = $bindable() }: ComponentProps<typeof RangeCalendar.Root> = $props();
</script>

<RangeCalendar.Root
	class="mt-6 rounded-15px border border-dark-10 bg-background-alt p-[22px] shadow-card"
	weekdayFormat="short"
	fixedWeeks={true}
	bind:value
	isDateDisabled={(date) => isWeekend(date, "en-US")}
	excludeDisabled
>
	{#snippet children({ months, weekdays })}
		<RangeCalendar.Header class="flex items-center justify-between">
			<RangeCalendar.PrevButton
				class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt hover:bg-muted active:scale-[0.98]"
			>
				<CaretLeft class="size-6" />
			</RangeCalendar.PrevButton>
			<RangeCalendar.Heading class="text-[15px] font-medium" />
			<RangeCalendar.NextButton
				class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt hover:bg-muted active:scale-[0.98]"
			>
				<CaretRight class="size-6" />
			</RangeCalendar.NextButton>
		</RangeCalendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4">
			{#each months as month (month.value.month)}
				<RangeCalendar.Grid class="w-full border-collapse space-y-1 select-none">
					<RangeCalendar.GridHead>
						<RangeCalendar.GridRow class="mb-1 flex w-full justify-between">
							{#each weekdays as day (day)}
								<RangeCalendar.HeadCell
									class="w-10 rounded-md text-xs font-normal! text-muted-foreground"
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
										class="relative m-0 size-10 p-0! text-center text-sm focus-within:z-20"
									>
										<RangeCalendar.Day
											class={cn(
												"group relative inline-flex size-10 items-center justify-center overflow-visible rounded-9px border border-transparent bg-transparent p-0 text-sm font-normal whitespace-nowrap text-foreground hover:border-foreground focus-visible:ring-foreground! data-disabled:pointer-events-none data-disabled:text-foreground/30 data-highlighted:rounded-none data-highlighted:bg-muted data-outside-month:pointer-events-none data-selected:bg-muted data-selected:font-medium data-selected:text-foreground data-selection-end:rounded-9px data-selection-end:bg-foreground data-selection-end:font-medium data-selection-end:text-background data-selection-start:rounded-9px data-selection-start:bg-foreground data-selection-start:font-medium data-selection-start:text-background data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:text-muted-foreground data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0!"
											)}
										>
											<div
												class="absolute top-[5px] hidden size-1 rounded-full bg-foreground group-data-selected:bg-background group-data-today:block"
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
