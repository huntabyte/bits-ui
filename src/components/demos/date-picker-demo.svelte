<script lang="ts">
	import { DatePicker } from "$lib";
	import { flyAndScale } from "@/utils";
	import { CaretLeft, CaretRight, CalendarBlank } from "phosphor-svelte";
</script>

<DatePicker.Root>
	<div class="flex min-w-[200px] flex-col gap-1">
		<DatePicker.Label class="block select-none">Check-in date</DatePicker.Label>
		<DatePicker.Input
			let:segments
			class="flex h-input w-full max-w-[300px] select-none items-center rounded-input border border-border-input bg-background p-3 text-sm shadow-mini"
		>
			{#each segments as { part, value }}
				<div class="inline-block select-none">
					<DatePicker.Segment
						{part}
						class="rounded-[3px] px-1 focus-visible:bg-foreground focus-visible:font-medium focus-visible:text-background focus-visible:outline-none data-[segment=literal]:px-px data-[segment=literal]:text-muted-foreground"
					>
						{value}
					</DatePicker.Segment>
				</div>
			{/each}
			<DatePicker.Trigger
				class="ml-auto rounded-[5px] p-1 transition-all hover:bg-dark-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				<CalendarBlank class="sq-5" />
			</DatePicker.Trigger>
		</DatePicker.Input>
		<DatePicker.Content sideOffset={10} transition={flyAndScale}>
			<DatePicker.Calendar
				class="rounded-card border border-dark-10 bg-background p-6 shadow-popover"
				let:months
				let:daysOfWeek
			>
				<DatePicker.CalendarHeader class="flex items-center justify-between">
					<DatePicker.CalendarPrevButton
						class="inline-flex items-center justify-center rounded-[7px] border border-border-input bg-background shadow-btn transition-all sq-7 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
					>
						<CaretLeft class="h-4 w-4" />
					</DatePicker.CalendarPrevButton>
					<DatePicker.CalendarHeading class="font-medium" />
					<DatePicker.CalendarNextButton
						class="inline-flex items-center justify-center rounded-[7px] border border-border-input bg-background shadow-btn transition-all sq-7 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
					>
						<CaretRight class="h-4 w-4" />
					</DatePicker.CalendarNextButton>
				</DatePicker.CalendarHeader>
				<div
					class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
				>
					{#each months as month}
						<DatePicker.CalendarGrid
							class="w-full border-collapse select-none space-y-1"
						>
							<DatePicker.CalendarGridHead>
								<DatePicker.CalendarGridRow class="flex w-full justify-between">
									{#each daysOfWeek as day}
										<DatePicker.CalendarHeadCell
											class="w-7 rounded-md text-[0.8rem] font-medium text-muted-foreground"
										>
											<div>{day}</div>
										</DatePicker.CalendarHeadCell>
									{/each}
								</DatePicker.CalendarGridRow>
							</DatePicker.CalendarGridHead>
							<DatePicker.CalendarGridBody>
								{#each month.weeks as weekDates}
									<DatePicker.CalendarGridRow
										class="mt-0.5 flex w-full gap-0.5"
									>
										{#each weekDates as date}
											<DatePicker.CalendarCell
												{date}
												class="relative p-0 text-center text-sm sq-7 focus-within:relative focus-within:z-20"
											>
												<DatePicker.CalendarDate
													{date}
													month={month.value}
													class="inline-flex items-center justify-center whitespace-nowrap rounded-[7px] bg-background p-0 text-sm font-normal text-foreground ring-offset-background transition-colors sq-7 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[selected]:bg-foreground data-[selected]:text-background data-[disabled]:opacity-50 data-[outside-month]:opacity-20 "
												/>
											</DatePicker.CalendarCell>
										{/each}
									</DatePicker.CalendarGridRow>
								{/each}
							</DatePicker.CalendarGridBody>
						</DatePicker.CalendarGrid>
					{/each}
				</div>
			</DatePicker.Calendar>
		</DatePicker.Content>
	</div>
</DatePicker.Root>
