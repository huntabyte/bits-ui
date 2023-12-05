<script lang="ts">
	import { DatePicker } from "$lib";
	import { flyAndScale } from "@/utils";
	import { CaretLeft, CaretRight, CalendarBlank } from "phosphor-svelte";
</script>

<DatePicker.Root weekdayFormat="short" fixedWeeks={true}>
	<div class="flex min-w-[200px] flex-col gap-1">
		<DatePicker.Label class="block select-none font-medium"
			>Birthday</DatePicker.Label
		>
		<DatePicker.Input
			let:segments
			class="flex h-input w-full max-w-[300px] select-none items-center rounded-input border border-border-input bg-background py-3 pl-3 pr-1 text-sm shadow-mini"
		>
			{#each segments as { part, value }}
				<div class="inline-block select-none">
					<DatePicker.Segment
						{part}
						class="rounded-[3px] px-1 data-[segment=literal]:px-px data-[segment=literal]:text-muted-foreground"
					>
						{value}
					</DatePicker.Segment>
				</div>
			{/each}
			<DatePicker.Trigger
				class="ml-auto inline-flex items-center justify-center rounded-[5px] transition-all sq-9 hover:bg-muted active:bg-dark-10"
			>
				<CalendarBlank class="sq-5" />
			</DatePicker.Trigger>
		</DatePicker.Input>
		<DatePicker.Content sideOffset={6} transition={flyAndScale} class="z-50">
			<DatePicker.Calendar
				class="rounded-[15px] border border-dark-10 bg-background p-[22px] shadow-card"
				let:months
				let:weekdays
			>
				<DatePicker.Header class="flex items-center justify-between">
					<DatePicker.PrevButton
						class="inline-flex items-center justify-center rounded-9px bg-background transition-all sq-10 hover:bg-muted active:scale-98"
					>
						<CaretLeft class="sq-6" />
					</DatePicker.PrevButton>
					<DatePicker.Heading class="text-[15px] font-medium" />
					<DatePicker.NextButton
						class="inline-flex items-center justify-center rounded-9px bg-background transition-all sq-10 hover:bg-muted active:scale-98"
					>
						<CaretRight class="sq-6" />
					</DatePicker.NextButton>
				</DatePicker.Header>
				<div
					class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
				>
					{#each months as month}
						<DatePicker.Grid
							class="w-full border-collapse select-none space-y-1"
						>
							<DatePicker.GridHead>
								<DatePicker.GridRow class="mb-1 flex w-full justify-between">
									{#each weekdays as day}
										<DatePicker.HeadCell
											class="w-10 rounded-md text-xs !font-normal text-muted-foreground"
										>
											<div>{day.slice(0, 2)}</div>
										</DatePicker.HeadCell>
									{/each}
								</DatePicker.GridRow>
							</DatePicker.GridHead>
							<DatePicker.GridBody>
								{#each month.weeks as weekDates}
									<DatePicker.GridRow class="flex w-full">
										{#each weekDates as date}
											<DatePicker.Cell
												{date}
												class="relative !p-0 text-center text-sm sq-10"
											>
												<DatePicker.Day
													{date}
													month={month.value}
													class="group relative inline-flex items-center justify-center whitespace-nowrap rounded-9px border border-transparent bg-transparent p-0 text-sm font-normal text-foreground transition-all sq-10 hover:border-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[selected]:bg-foreground data-[selected]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-background data-[unavailable]:text-muted-foreground data-[unavailable]:line-through"
												>
													<div
														class="absolute top-[5px] hidden rounded-full bg-foreground transition-all sq-1 group-data-[today]:block group-data-[selected]:bg-background"
													/>
													{date.day}
												</DatePicker.Day>
											</DatePicker.Cell>
										{/each}
									</DatePicker.GridRow>
								{/each}
							</DatePicker.GridBody>
						</DatePicker.Grid>
					{/each}
				</div>
			</DatePicker.Calendar>
		</DatePicker.Content>
	</div>
</DatePicker.Root>
