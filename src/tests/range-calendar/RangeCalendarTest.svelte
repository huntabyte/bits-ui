<script lang="ts">
	import { RangeCalendar } from "$lib";

	type $$Props = RangeCalendar.Props;

	export let placeholder: $$Props["placeholder"] = undefined;
	export let value: $$Props["value"] = undefined;
</script>

<main>
	<div data-testid="start-value">{value?.start}</div>
	<div data-testid="end-value">{value?.end}</div>

	<RangeCalendar.Root
		let:months
		let:weekdays
		bind:placeholder
		bind:value
		{...$$restProps}
		data-testid="calendar"
	>
		<RangeCalendar.Header data-testid="header">
			<RangeCalendar.PrevButton data-testid="prev-button"
				>Prev</RangeCalendar.PrevButton
			>
			<RangeCalendar.Heading data-testid="heading" />
			<RangeCalendar.NextButton data-testid="next-button"
				>Next</RangeCalendar.NextButton
			>
		</RangeCalendar.Header>
		<div>
			{#each months as month}
				{@const m = month.value.month}
				<RangeCalendar.Grid data-testid="grid-{m}">
					<RangeCalendar.GridHead data-testid="grid-head-{m}">
						<RangeCalendar.GridRow data-testid="grid-row-{m}">
							{#each weekdays as day, i}
								<RangeCalendar.HeadCell data-testid="weekday-{m}-{i}">
									{day}
								</RangeCalendar.HeadCell>
							{/each}
						</RangeCalendar.GridRow>
					</RangeCalendar.GridHead>
					<RangeCalendar.GridBody data-testid="grid-body-{m}">
						{#each month.weeks as weekDates, i}
							<RangeCalendar.GridRow data-testid="grid-row-{m}-{i}" data-week>
								{#each weekDates as date, d}
									<RangeCalendar.Cell
										{date}
										data-testid="cell-{date.month}-{d}"
									>
										<RangeCalendar.Day
											{date}
											month={month.value}
											data-testid="date-{date.month}-{date.day}"
										>
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
</main>
