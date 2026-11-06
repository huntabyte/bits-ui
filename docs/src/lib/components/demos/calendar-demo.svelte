<script lang="ts">
	import { Calendar } from "bits-ui";
	import CaretLeft from "phosphor-svelte/lib/CaretLeft";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import { getLocalTimeZone, today } from "@internationalized/date";

	let value = $state(today(getLocalTimeZone()));
</script>

<Calendar.Root
	class="mt-6 rounded-[15px] border border-dark-10 bg-background-alt p-[22px] shadow-card"
	weekdayFormat="short"
	fixedWeeks={true}
	type="single"
	bind:value
>
	{#snippet children({ months, weekdays })}
		<Calendar.Header class="flex items-center justify-between">
			<Calendar.PrevButton
				class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt hover:bg-muted active:scale-[0.98] active:transition-all"
			>
				<CaretLeft class="size-6" />
			</Calendar.PrevButton>
			<Calendar.Heading class="text-[15px] font-medium" />
			<Calendar.NextButton
				class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt hover:bg-muted active:scale-[0.98] active:transition-all"
			>
				<CaretRight class="size-6" />
			</Calendar.NextButton>
		</Calendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4">
			{#each months as month, i (i)}
				<Calendar.Grid class="w-full border-collapse space-y-1 select-none">
					<Calendar.GridHead>
						<Calendar.GridRow class="mb-1 flex w-full justify-between">
							{#each weekdays as day, i (i)}
								<Calendar.HeadCell
									class="w-10 rounded-md text-xs font-normal! text-muted-foreground"
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
										class="relative size-10 p-0! text-center text-sm"
									>
										<Calendar.Day
											class="group relative inline-flex size-10 items-center justify-center rounded-9px border border-transparent bg-transparent p-0 text-sm font-normal whitespace-nowrap text-foreground hover:border-foreground data-disabled:pointer-events-none data-disabled:text-foreground/30 data-outside-month:pointer-events-none data-selected:bg-foreground data-selected:font-medium data-selected:text-background data-unavailable:text-muted-foreground data-unavailable:line-through"
										>
											<div
												class="absolute top-[5px] hidden size-1 rounded-full bg-foreground group-data-selected:bg-background group-data-today:block"
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
