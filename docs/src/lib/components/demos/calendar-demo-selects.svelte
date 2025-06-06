<script lang="ts">
	import { Calendar } from "bits-ui";
	import { getLocalTimeZone, today } from "@internationalized/date";

	let value = $state(today(getLocalTimeZone()));
</script>

<Calendar.Root
	class="border-dark-10 bg-background-alt shadow-card mt-6 rounded-[15px] border p-[22px]"
	weekdayFormat="short"
	fixedWeeks={true}
	type="single"
	bind:value
>
	{#snippet children({ months, weekdays })}
		<Calendar.Header class="flex items-center justify-between gap-3">
			<Calendar.MonthSelect aria-label="Select month" class="w-full" />
			<Calendar.YearSelect aria-label="Select year" />
		</Calendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
			{#each months as month, i (i)}
				<Calendar.Grid class="w-full border-collapse select-none space-y-1">
					<Calendar.GridHead>
						<Calendar.GridRow class="mb-1 flex w-full justify-between">
							{#each weekdays as day, i (i)}
								<Calendar.HeadCell
									class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
								>
									<div>{day.slice(0, 2)}</div>
								</Calendar.HeadCell>
							{/each}
						</Calendar.GridRow>
					</Calendar.GridHead>
					<Calendar.GridBody>
						{#each month.weeks as weekDates, i (i)}
							<Calendar.GridRow class="flex w-full">
								{#each weekDates as date, i (i)}
									<Calendar.Cell
										{date}
										month={month.value}
										class="p-0! relative size-10 text-center text-sm"
									>
										<Calendar.Day
											class="rounded-9px text-foreground hover:border-foreground data-selected:bg-foreground data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
										>
											<div
												class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
											></div>
											{date.day}
										</Calendar.Day>
									</Calendar.Cell>
								{/each}
							</Calendar.GridRow>
						{/each}
					</Calendar.GridBody>
				</Calendar.Grid>
			{/each}
		</div>
	{/snippet}
</Calendar.Root>
