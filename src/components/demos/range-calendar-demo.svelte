<script lang="ts">
	import { RangeCalendar } from "$lib";
	import { cn } from "@/utils";
	import { CaretRight, CaretLeft } from "phosphor-svelte";
</script>

<RangeCalendar.Root
	class="mt-6 rounded-15px border border-dark-10 bg-background p-[22px] shadow-card"
	let:months
	let:weekdays
	weekdayFormat="short"
	fixedWeeks={true}
>
	<RangeCalendar.Header class="flex items-center justify-between">
		<RangeCalendar.PrevButton
			class="inline-flex items-center justify-center rounded-9px bg-background sq-10 hover:bg-muted active:scale-98"
		>
			<CaretLeft class="sq-6" />
		</RangeCalendar.PrevButton>
		<RangeCalendar.Heading class="text-[15px] font-medium" />
		<RangeCalendar.NextButton
			class="inline-flex items-center justify-center rounded-9px bg-background sq-10 hover:bg-muted active:scale-98"
		>
			<CaretRight class="sq-6" />
		</RangeCalendar.NextButton>
	</RangeCalendar.Header>
	<div
		class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
	>
		{#each months as month}
			<RangeCalendar.Grid class="w-full border-collapse select-none space-y-1">
				<RangeCalendar.GridHead>
					<RangeCalendar.GridRow class="mb-1 flex w-full justify-between">
						{#each weekdays as day}
							<RangeCalendar.HeadCell
								class="w-10 rounded-md text-xs !font-normal text-muted-foreground"
							>
								<div>{day.slice(0, 2)}</div>
							</RangeCalendar.HeadCell>
						{/each}
					</RangeCalendar.GridRow>
				</RangeCalendar.GridHead>
				<RangeCalendar.GridBody>
					{#each month.weeks as weekDates}
						<RangeCalendar.GridRow class="flex w-full">
							{#each weekDates as date}
								<RangeCalendar.Cell
									{date}
									class="relative m-0 !p-0 text-center text-sm sq-10"
								>
									<RangeCalendar.Day
										{date}
										month={month.value}
										class={cn(
											"group relative inline-flex items-center justify-center whitespace-nowrap rounded-9px border border-transparent bg-background bg-transparent p-0 text-sm font-normal text-foreground sq-10 hover:border-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[highlighted]:rounded-none data-[selection-end]:rounded-9px data-[selection-start]:rounded-9px data-[highlighted]:bg-muted data-[selected]:bg-muted data-[selection-end]:bg-foreground data-[selection-start]:bg-foreground data-[selected]:font-medium data-[selection-end]:font-medium data-[selection-start]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-foreground data-[selection-end]:text-background data-[selection-start]:text-background data-[unavailable]:text-muted-foreground data-[unavailable]:line-through data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none"
										)}
									>
										<div
											class="absolute top-[5px] hidden rounded-full bg-foreground sq-1 group-data-[today]:block group-data-[selected]:bg-background"
										/>
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
</RangeCalendar.Root>
