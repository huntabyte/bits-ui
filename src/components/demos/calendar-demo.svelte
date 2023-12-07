<script lang="ts">
	import { Calendar } from "$lib";
	import { CaretLeft, CaretRight } from "phosphor-svelte";

	const isDateUnavailable: Calendar.Props["isDateUnavailable"] = (date) => {
		return date.day === 17 || date.day === 18;
	};
</script>

<Calendar.Root
	class="mt-6 rounded-[15px] border border-dark-10 bg-background p-[22px] shadow-card"
	let:months
	let:weekdays
	{isDateUnavailable}
	weekdayFormat="short"
	fixedWeeks={true}
>
	<Calendar.Header class="flex items-center justify-between">
		<Calendar.PrevButton
			class="inline-flex items-center justify-center rounded-9px bg-background sq-10 hover:bg-muted active:scale-98 active:transition-all"
		>
			<CaretLeft class="sq-6" />
		</Calendar.PrevButton>
		<Calendar.Heading class="text-[15px] font-medium" />
		<Calendar.NextButton
			class="inline-flex items-center justify-center rounded-9px bg-background sq-10 hover:bg-muted active:scale-98 active:transition-all"
		>
			<CaretRight class="sq-6" />
		</Calendar.NextButton>
	</Calendar.Header>
	<div
		class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
	>
		{#each months as month, i (i)}
			<Calendar.Grid class="w-full border-collapse select-none space-y-1">
				<Calendar.GridHead>
					<Calendar.GridRow class="mb-1 flex w-full justify-between">
						{#each weekdays as day}
							<Calendar.HeadCell
								class="w-10 rounded-md text-xs !font-normal text-muted-foreground"
							>
								<div>{day.slice(0, 2)}</div>
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="flex w-full">
							{#each weekDates as date}
								<Calendar.Cell
									{date}
									class="relative !p-0 text-center text-sm sq-10"
								>
									<Calendar.Day
										{date}
										month={month.value}
										class="group relative inline-flex items-center justify-center whitespace-nowrap rounded-9px border border-transparent bg-transparent p-0 text-sm font-normal text-foreground sq-10 hover:border-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[selected]:bg-foreground data-[selected]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-background data-[unavailable]:text-muted-foreground data-[unavailable]:line-through"
									>
										<div
											class="absolute top-[5px] hidden rounded-full bg-foreground sq-1 group-data-[today]:block group-data-[selected]:bg-background"
										/>
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
</Calendar.Root>
