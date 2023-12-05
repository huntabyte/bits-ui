<script lang="ts">
	import { DateRangePicker, type DateRange } from "$lib";
	import { cn, flyAndScale } from "@/utils";
	import { CaretLeft, CaretRight, CalendarBlank } from "phosphor-svelte";

	let value: DateRange | undefined = undefined;
</script>

<DateRangePicker.Root bind:value weekdayFormat="short" fixedWeeks={true}>
	<div class="flex min-w-[200px] flex-col gap-1">
		<DateRangePicker.Label class="block select-none font-medium"
			>Rental Days</DateRangePicker.Label
		>
		<DateRangePicker.Input
			let:segments
			class="flex h-input w-full max-w-[300px] select-none items-center rounded-input border border-border-input bg-background py-3 pl-3 pr-1 text-sm shadow-mini"
		>
			{#each segments.start as { part, value }}
				<div class="inline-block select-none">
					<DateRangePicker.Segment
						{part}
						type="start"
						class="rounded-[3px] px-1 data-[segment=literal]:px-px data-[segment=literal]:text-muted-foreground"
					>
						{value}
					</DateRangePicker.Segment>
				</div>
			{/each}
			<div aria-hidden class="px-1">-</div>
			{#each segments.end as { part, value }}
				<div class="inline-block select-none">
					<DateRangePicker.Segment
						{part}
						type="end"
						class="rounded-[3px] px-1 data-[segment=literal]:px-px data-[segment=literal]:text-muted-foreground"
					>
						{value}
					</DateRangePicker.Segment>
				</div>
			{/each}
			<DateRangePicker.Trigger
				class="ml-auto inline-flex items-center justify-center rounded-[5px] transition-all sq-9 hover:bg-muted active:bg-dark-10"
			>
				<CalendarBlank class="sq-5" />
			</DateRangePicker.Trigger>
		</DateRangePicker.Input>
		<DateRangePicker.Content
			sideOffset={6}
			transition={flyAndScale}
			class="z-50"
		>
			<DateRangePicker.Calendar
				class="mt-6 rounded-15px border border-dark-10 bg-background p-[22px] shadow-card"
				let:months
				let:weekdays
			>
				<DateRangePicker.Header class="flex items-center justify-between">
					<DateRangePicker.PrevButton
						class="inline-flex items-center justify-center rounded-9px bg-background transition-all sq-10 hover:bg-muted active:scale-98"
					>
						<CaretLeft class="sq-6" />
					</DateRangePicker.PrevButton>
					<DateRangePicker.Heading class="text-[15px] font-medium" />
					<DateRangePicker.NextButton
						class="inline-flex items-center justify-center rounded-9px bg-background transition-all sq-10 hover:bg-muted active:scale-98"
					>
						<CaretRight class="sq-6" />
					</DateRangePicker.NextButton>
				</DateRangePicker.Header>
				<div
					class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
				>
					{#each months as month}
						<DateRangePicker.Grid
							class="w-full border-collapse select-none space-y-1"
						>
							<DateRangePicker.GridHead>
								<DateRangePicker.GridRow
									class="mb-1 flex w-full justify-between"
								>
									{#each weekdays as day}
										<DateRangePicker.HeadCell
											class="w-10 rounded-md text-xs !font-normal text-muted-foreground"
										>
											<div>{day.slice(0, 2)}</div>
										</DateRangePicker.HeadCell>
									{/each}
								</DateRangePicker.GridRow>
							</DateRangePicker.GridHead>
							<DateRangePicker.GridBody>
								{#each month.weeks as weekDates}
									<DateRangePicker.GridRow class="flex w-full">
										{#each weekDates as date}
											<DateRangePicker.Cell
												{date}
												class="relative m-0 !p-0 text-center text-sm sq-10"
											>
												<DateRangePicker.Day
													{date}
													month={month.value}
													class={cn(
														"group relative inline-flex items-center justify-center whitespace-nowrap rounded-9px border border-transparent bg-background bg-transparent p-0 text-sm font-normal text-foreground transition-all sq-10 hover:border-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[highlighted]:rounded-none data-[selection-end]:rounded-9px data-[selection-start]:rounded-9px data-[highlighted]:bg-muted data-[selected]:bg-muted data-[selection-end]:bg-foreground data-[selection-start]:bg-foreground data-[selected]:font-medium data-[selection-end]:font-medium data-[selection-start]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-foreground data-[selection-end]:text-background data-[selection-start]:text-background data-[unavailable]:text-muted-foreground data-[unavailable]:line-through data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none"
													)}
												>
													<div
														class="absolute top-[5px] hidden rounded-full bg-foreground transition-all sq-1 group-data-[today]:block group-data-[selected]:bg-background"
													/>
													{date.day}
												</DateRangePicker.Day>
											</DateRangePicker.Cell>
										{/each}
									</DateRangePicker.GridRow>
								{/each}
							</DateRangePicker.GridBody>
						</DateRangePicker.Grid>
					{/each}
				</div>
			</DateRangePicker.Calendar>
		</DateRangePicker.Content>
	</div>
</DateRangePicker.Root>
