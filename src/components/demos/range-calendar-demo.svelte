<script lang="ts">
	import { RangeCalendar } from "$lib";
	import { CaretRight, CaretLeft } from "phosphor-svelte";
</script>

<RangeCalendar.Root
	class="mt-6 rounded-card border border-dark-10 bg-background p-6 shadow-card"
	let:months
	let:daysOfWeek
>
	<RangeCalendar.Header class="flex items-center justify-between">
		<RangeCalendar.PrevButton
			class="inline-flex items-center justify-center rounded-[7px] border border-border-input bg-background shadow-btn transition-all sq-7 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
		>
			<CaretLeft class="sq-4" />
		</RangeCalendar.PrevButton>
		<RangeCalendar.Heading class="font-medium" />
		<RangeCalendar.NextButton
			class="inline-flex items-center justify-center rounded-[7px] border border-border-input bg-background shadow-btn transition-all sq-7 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
		>
			<CaretRight class="sq-4" />
		</RangeCalendar.NextButton>
	</RangeCalendar.Header>
	<div
		class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
	>
		{#each months as month}
			<RangeCalendar.Grid class="w-full border-collapse select-none space-y-1">
				<RangeCalendar.GridHead>
					<RangeCalendar.GridRow class="flex w-full justify-between">
						{#each daysOfWeek as day}
							<RangeCalendar.HeadCell
								class="w-8 rounded-md text-[0.8rem] font-medium text-muted-foreground"
							>
								<div>{day}</div>
							</RangeCalendar.HeadCell>
						{/each}
					</RangeCalendar.GridRow>
				</RangeCalendar.GridHead>
				<RangeCalendar.GridBody>
					{#each month.weeks as weekDates}
						<RangeCalendar.GridRow class="mt-0.5 flex w-full gap-0.5">
							{#each weekDates as date}
								<RangeCalendar.Cell
									{date}
									class="relative p-0 text-center text-sm sq-8 focus-within:relative focus-within:z-20"
								>
									<RangeCalendar.Date
										{date}
										month={month.value}
										class="inline-flex items-center justify-center whitespace-nowrap rounded-[5px] bg-background p-0 text-sm font-normal text-foreground ring-offset-background transition-colors sq-8 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[highlighted]:bg-muted data-[selected]:bg-foreground data-[selection-end]:bg-foreground data-[selection-start]:bg-foreground data-[selected]:text-background data-[disabled]:opacity-50 data-[outside-month]:opacity-20"
									/>
								</RangeCalendar.Cell>
							{/each}
						</RangeCalendar.GridRow>
					{/each}
				</RangeCalendar.GridBody>
			</RangeCalendar.Grid>
		{/each}
	</div>
</RangeCalendar.Root>
