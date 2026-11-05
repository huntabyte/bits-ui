<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
	import CaretLeft from "phosphor-svelte/lib/CaretLeft";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
</script>

<DateRangePicker.Root
	weekdayFormat="short"
	fixedWeeks={true}
	class="flex w-full max-w-[340px] flex-col gap-1.5"
>
	<DateRangePicker.Label class="block text-sm font-medium select-none"
		>Rental Days</DateRangePicker.Label
	>
	<div
		class="flex h-input w-full items-center rounded-input border border-border-input bg-background px-2 py-3 text-sm tracking-[0.01em] text-foreground select-none focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
	>
		{#each ["start", "end"] as const as type (type)}
			<DateRangePicker.Input {type}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (part + i)}
						<div class="inline-block select-none">
							{#if part === "literal"}
								<DateRangePicker.Segment {part} class="p-1 text-muted-foreground">
									{value}
								</DateRangePicker.Segment>
							{:else}
								<DateRangePicker.Segment
									{part}
									class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:ring-0! focus-visible:ring-offset-0! aria-[valuetext=Empty]:text-muted-foreground"
								>
									{value}
								</DateRangePicker.Segment>
							{/if}
						</div>
					{/each}
				{/snippet}
			</DateRangePicker.Input>
			{#if type === "start"}
				<div aria-hidden="true" class="px-1 text-muted-foreground">–⁠⁠⁠⁠⁠</div>
			{/if}
		{/each}

		<DateRangePicker.Trigger
			class="ml-auto inline-flex size-8 items-center justify-center rounded-[5px] text-foreground/60 transition-all hover:bg-muted active:bg-dark-10"
		>
			<CalendarBlank class="size-6" />
		</DateRangePicker.Trigger>
	</div>
	<DateRangePicker.Content sideOffset={6} class="z-50">
		<DateRangePicker.Calendar
			class="mt-6 rounded-15px border border-dark-10 bg-background-alt p-[22px] shadow-popover"
		>
			{#snippet children({ months, weekdays })}
				<DateRangePicker.Header class="flex items-center justify-between">
					<DateRangePicker.PrevButton
						class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt transition-all hover:bg-muted active:scale-[0.98]"
					>
						<CaretLeft class="size-6" />
					</DateRangePicker.PrevButton>
					<DateRangePicker.Heading class="text-[15px] font-medium" />
					<DateRangePicker.NextButton
						class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt transition-all hover:bg-muted active:scale-[0.98]"
					>
						<CaretRight class="size-6" />
					</DateRangePicker.NextButton>
				</DateRangePicker.Header>
				<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-y-0 sm:space-x-4">
					{#each months as month (month.value)}
						<DateRangePicker.Grid class="w-full border-collapse space-y-1 select-none">
							<DateRangePicker.GridHead>
								<DateRangePicker.GridRow class="mb-1 flex w-full justify-between">
									{#each weekdays as day (day)}
										<DateRangePicker.HeadCell
											class="w-10 rounded-md text-xs font-normal! text-muted-foreground"
										>
											<div>{day.slice(0, 2)}</div>
										</DateRangePicker.HeadCell>
									{/each}
								</DateRangePicker.GridRow>
							</DateRangePicker.GridHead>
							<DateRangePicker.GridBody>
								{#each month.weeks as weekDates (weekDates)}
									<DateRangePicker.GridRow class="flex w-full">
										{#each weekDates as date (date)}
											<DateRangePicker.Cell
												{date}
												month={month.value}
												class="relative m-0 size-10 overflow-visible p-0! text-center text-sm focus-within:relative focus-within:z-20"
											>
												<DateRangePicker.Day
													class="group relative inline-flex size-10 items-center justify-center overflow-visible rounded-9px border border-transparent bg-transparent p-0 text-sm font-normal whitespace-nowrap text-foreground transition-all hover:border-foreground  focus-visible:ring-foreground! data-disabled:pointer-events-none data-disabled:text-foreground/30 data-highlighted:rounded-none data-highlighted:bg-muted data-outside-month:pointer-events-none data-selected:bg-muted data-selected:font-medium data-selected:text-foreground data-selection-end:rounded-9px data-selection-end:bg-foreground data-selection-end:font-medium data-selection-end:text-background data-selection-start:rounded-9px data-selection-start:bg-foreground data-selection-start:font-medium data-selection-start:text-background data-selection-start:focus-visible:ring-2 data-selection-start:focus-visible:ring-offset-2! data-unavailable:text-muted-foreground data-unavailable:line-through data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:rounded-none data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:border-foreground data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-0! data-selected:[&:not([data-selection-start])]:[&:not([data-selection-end])]:focus-visible:ring-offset-0!"
												>
													<div
														class="absolute top-[5px] hidden size-1 rounded-full bg-foreground transition-all group-data-selected:bg-background group-data-today:block"
													></div>
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
			{/snippet}
		</DateRangePicker.Calendar>
	</DateRangePicker.Content>
</DateRangePicker.Root>
