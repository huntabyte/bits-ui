<script lang="ts">
	import { Calendar } from "$lib";

	type $$Props = Calendar.Props<true>;

	export let placeholder: $$Props["placeholder"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let multiple: $$Props["multiple"] = true;
</script>

<main>
	<div data-testid="value">{value}</div>
	<Calendar.Root
		let:months
		let:weekdays
		bind:placeholder
		bind:value
		{...$$restProps}
		{multiple}
		data-testid="calendar"
	>
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
									<Calendar.Cell {date} data-testid="cell-{date.month}-{d}">
										<Calendar.Day
											{date}
											month={month.value}
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
	</Calendar.Root>
</main>
