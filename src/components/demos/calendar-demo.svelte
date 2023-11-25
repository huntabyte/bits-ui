<script lang="ts">
	import { Calendar } from "$lib";
	import { CaretRight, CaretLeft } from "phosphor-svelte";
</script>

<Calendar.Root
	class="mt-6 rounded-card border bg-background p-6 shadow-card"
	let:months
	let:daysOfWeek
>
	<Calendar.Header class="flex items-center justify-between">
		<Calendar.PrevButton
			class="inline-flex h-7 w-7 items-center justify-center rounded-[7px] border border-border-input bg-background shadow-btn transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
		>
			<CaretLeft class="h-4 w-4" />
		</Calendar.PrevButton>
		<Calendar.Heading class="font-medium" />
		<Calendar.NextButton
			class="inline-flex h-7 w-7 items-center justify-center rounded-[7px] border border-border-input bg-background shadow-btn transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
		>
			<CaretRight class="h-4 w-4" />
		</Calendar.NextButton>
	</Calendar.Header>
	<div
		class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
	>
		{#each months as month}
			<Calendar.Grid class="w-full border-collapse space-y-1">
				<Calendar.GridHead>
					<Calendar.GridRow class="flex w-full justify-between">
						{#each daysOfWeek as day}
							<Calendar.HeadCell
								class="w-9 rounded-md text-[0.8rem] font-medium text-muted-foreground"
							>
								<div>{day}</div>
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="mt-2 flex w-full gap-1">
							{#each weekDates as date}
								<Calendar.Cell
									{date}
									class="relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20"
								>
									<Calendar.Date
										{date}
										month={month.value}
										class="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-[7px] bg-background p-0 text-sm font-normal text-foreground ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[selected]:bg-foreground data-[selected]:text-background data-[disabled]:opacity-50 data-[outside-month]:opacity-20"
									/>
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</div>
</Calendar.Root>
