<script lang="ts" module>
	import {
		DateRangePicker,
		type DateRangePickerInputProps,
		type WithoutChildrenOrChild,
	} from "bits-ui";
	export type DateRangePickerTestProps = WithoutChildrenOrChild<DateRangePicker.RootProps> & {
		startProps?: Omit<DateRangePickerInputProps, "type">;
		endProps?: Omit<DateRangePickerInputProps, "type">;
	};
</script>

<script lang="ts">
	let {
		placeholder,
		value,
		open = false,
		startProps,
		endProps,
		...restProps
	}: DateRangePickerTestProps = $props();

	function clear() {
		value = {
			start: undefined,
			end: undefined,
		};
	}
</script>

<main>
	<div data-testid="value">{value}</div>
	<div data-testid="open">{open}</div>
	<div data-testid="start-value">{String(value?.start)}</div>
	<div data-testid="end-value">{String(value?.end)}</div>
	<button onclick={clear}>clear</button>
	<button onclick={() => (open = !open)}>toggle open</button>
	<DateRangePicker.Root bind:value bind:placeholder bind:open {...restProps}>
		<DateRangePicker.Label data-testid="label">Rental Days</DateRangePicker.Label>
		{#each ["start", "end"] as const as type (type)}
			{@const inputProps = type === "start" ? startProps : endProps}
			<DateRangePicker.Input {type} data-testid="{type}-input" {...inputProps}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (i)}
						<DateRangePicker.Segment
							{part}
							data-testid={part === "literal" ? undefined : `${type}-${part}`}
						>
							{value}
						</DateRangePicker.Segment>
					{/each}
				{/snippet}
			</DateRangePicker.Input>
		{/each}

		<DateRangePicker.Trigger data-testid="trigger">Open</DateRangePicker.Trigger>
		<DateRangePicker.Content data-testid="content">
			<DateRangePicker.Calendar data-testid="calendar">
				{#snippet children({ months, weekdays })}
					<DateRangePicker.Header data-testid="header">
						<DateRangePicker.PrevButton data-testid="prev-button"
							>Prev</DateRangePicker.PrevButton
						>
						<DateRangePicker.Heading data-testid="heading" />
						<DateRangePicker.NextButton data-testid="next-button"
							>Next</DateRangePicker.NextButton
						>
					</DateRangePicker.Header>
					<div>
						{#each months as month, i (i)}
							{@const m = month.value.month}
							<DateRangePicker.Grid data-testid="grid-{m}">
								<DateRangePicker.GridHead data-testid="grid-head-{m}">
									<DateRangePicker.GridRow data-testid="grid-row-{m}">
										{#each weekdays as day, i (i)}
											<DateRangePicker.HeadCell data-testid="weekday-{m}-{i}">
												{day}
											</DateRangePicker.HeadCell>
										{/each}
									</DateRangePicker.GridRow>
								</DateRangePicker.GridHead>
								<DateRangePicker.GridBody data-testid="grid-body-{m}">
									{#each month.weeks as weekDates, i (i)}
										<DateRangePicker.GridRow
											data-testid="grid-row-{m}-{i}"
											data-week
										>
											{#each weekDates as date, d (d)}
												<DateRangePicker.Cell
													{date}
													month={month.value}
													data-testid="cell-{date.month}-{d}"
												>
													<DateRangePicker.Day
														data-testid="date-{date.month}-{date.day}"
													>
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
</main>
