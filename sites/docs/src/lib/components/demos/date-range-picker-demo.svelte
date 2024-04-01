<script lang="ts">
	import { type DateRange, DateRangePicker } from "bits-ui";
	import { CalendarBlank, CaretLeft, CaretRight } from "$icons/index.js";
	import { cn, flyAndScale } from "$lib/utils/index.js";

	let value: DateRange | undefined = undefined;
</script>

<DateRangePicker.Root bind:value weekdayFormat="short" fixedWeeks={true}>
	<div class="flex w-full max-w-[320px] flex-col gap-1.5">
		<DateRangePicker.Label class="block select-none text-sm font-medium"
			>Rental Days</DateRangePicker.Label
		>
		<DateRangePicker.Input
			let:segments
			class="flex h-input w-full max-w-[320px] select-none items-center rounded-input border border-border-input bg-background px-2 py-3 text-sm tracking-[0.01em] text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
		>
			{#each segments.start as { part, value }}
				<div class="inline-block select-none">
					{#if part === "literal"}
						<DateRangePicker.Segment
							type="start"
							{part}
							class="p-1 text-muted-foreground"
						>
							{value}
						</DateRangePicker.Segment>
					{:else}
						<DateRangePicker.Segment
							type="start"
							{part}
							class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:!ring-0 focus-visible:!ring-offset-0 aria-[valuetext=Empty]:text-muted-foreground"
						>
							{value}
						</DateRangePicker.Segment>
					{/if}
				</div>
			{/each}
			<div aria-hidden class="px-1 text-muted-foreground">–</div>
			{#each segments.end as { part, value }}
				<div class="inline-block select-none">
					{#if part === "literal"}
						<DateRangePicker.Segment
							type="end"
							{part}
							class="p-1 text-muted-foreground"
						>
							{value}
						</DateRangePicker.Segment>
					{:else}
						<DateRangePicker.Segment
							type="end"
							{part}
							class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:!ring-0 focus-visible:!ring-offset-0 aria-[valuetext=Empty]:text-muted-foreground"
						>
							{value}
						</DateRangePicker.Segment>
					{/if}
				</div>
			{/each}
			<DateRangePicker.Trigger
				class="ml-auto inline-flex size-8 items-center justify-center rounded-[5px] text-foreground/60 transition-all hover:bg-muted active:bg-dark-10"
			>
				<CalendarBlank class="size-6" />
			</DateRangePicker.Trigger>
		</DateRangePicker.Input>
		<DateRangePicker.Content sideOffset={6} transition={flyAndScale} class="z-50">
			<DateRangePicker.Calendar
				class="mt-6 rounded-15px border border-dark-10 bg-background-alt p-[22px] shadow-popover"
				let:months
				let:weekdays
			>
				<DateRangePicker.Header class="flex items-center justify-between">
					<DateRangePicker.PrevButton
						class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt transition-all hover:bg-muted active:scale-98"
					>
						<CaretLeft class="size-6" />
					</DateRangePicker.PrevButton>
					<DateRangePicker.Heading class="text-[15px] font-medium" />
					<DateRangePicker.NextButton
						class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt transition-all hover:bg-muted active:scale-98"
					>
						<CaretRight class="size-6" />
					</DateRangePicker.NextButton>
				</DateRangePicker.Header>
				<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
					{#each months as month}
						<DateRangePicker.Grid class="w-full border-collapse select-none space-y-1">
							<DateRangePicker.GridHead>
								<DateRangePicker.GridRow class="mb-1 flex w-full justify-between">
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
												class="relative m-0 size-10 overflow-visible !p-0 text-center text-sm focus-within:relative focus-within:z-20"
											>
												<DateRangePicker.Day
													{date}
													month={month.value}
													class={cn(
														"group relative inline-flex size-10 items-center justify-center overflow-visible whitespace-nowrap rounded-9px border border-transparent bg-background bg-transparent p-0 text-sm font-normal text-foreground transition-all hover:border-foreground  focus-visible:!ring-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[highlighted]:rounded-none data-[selection-end]:rounded-9px data-[selection-start]:rounded-9px data-[highlighted]:bg-muted data-[selected]:bg-muted data-[selection-end]:bg-foreground data-[selection-start]:bg-foreground data-[selected]:font-medium data-[selection-end]:font-medium data-[selection-start]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-foreground data-[selection-end]:text-background data-[selection-start]:text-background data-[unavailable]:text-muted-foreground data-[unavailable]:line-through data-[selection-start]:focus-visible:ring-2 data-[selection-start]:focus-visible:!ring-offset-2 data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:!ring-0 data-[selected]:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:!ring-offset-0"
													)}
												>
													<div
														class="absolute top-[5px] hidden size-1 rounded-full bg-foreground transition-all group-data-[today]:block group-data-[selected]:bg-background"
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
