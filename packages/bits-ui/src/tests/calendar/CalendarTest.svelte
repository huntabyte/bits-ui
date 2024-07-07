<script lang="ts" context="module">
	export type CalendarSingleTestProps = Omit<
		WithoutChildren<Calendar.RootProps>,
		"value" | "onValueChange"
	> & {
		value?: DateValue | undefined;
		onValueChange?: (value: DateValue | undefined) => void;
	};
</script>

<script lang="ts">
	import { Calendar, type WithoutChildren } from "$lib/index.js";
	import type { DateValue } from "@internationalized/date";

	let { placeholder, value, type = "single", ...restProps }: CalendarSingleTestProps = $props();

	function changeValue(field: "day" | "month" | "year") {
		if (value) {
			value = value.cycle(field, 1);
		} else if (placeholder) {
			placeholder = placeholder.cycle(field, 1);
		}
	}
</script>

<main>
	<div data-testid="value">{String(value?.toString())}</div>
	<button onclick={() => changeValue("day")} data-testid="add-day"> Add Day </button>
	<button onclick={() => changeValue("month")} data-testid="add-month">Add Month</button>
	<button onclick={() => changeValue("year")} data-testid="add-year">Add Year</button>
	<Calendar.Root type="single" bind:placeholder bind:value {...restProps} data-testid="calendar">
		{#snippet children({ months, weekdays })}
			<Calendar.Header data-testid="header">
				<Calendar.PrevButton data-testid="prev-button">Prev</Calendar.PrevButton>
				<Calendar.Heading data-testid="heading" />
				<Calendar.NextButton data-testid="next-button">Next</Calendar.NextButton>
			</Calendar.Header>
			<div>
				{#each months as month}
					{@const m = month.value.month}
					<Calendar.Grid data-testid="grid-{m}">
						<Calendar.GridHead data-testid="grid-head-{m}">
							<Calendar.GridRow data-testid="grid-row-{m}">
								{#each weekdays as day, i}
									<Calendar.HeadCell data-testid="weekday-{m}-{i}">
										{day}
									</Calendar.HeadCell>
								{/each}
							</Calendar.GridRow>
						</Calendar.GridHead>
						<Calendar.GridBody data-testid="grid-body-{m}">
							{#each month.weeks as weekDates, i}
								<Calendar.GridRow data-testid="grid-row-{m}-{i}" data-week>
									{#each weekDates as date, d}
										<Calendar.Cell
											{date}
											month={month.value}
											data-testid="cell-{date.month}-{d}"
										>
											<Calendar.Day
												data-testid="date-{date.month}-{date.day}"
											>
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
</main>
