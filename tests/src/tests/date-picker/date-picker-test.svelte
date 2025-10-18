<script lang="ts" module>
	import { DatePicker, type WithoutChildrenOrChild } from "bits-ui";
	export type DatePickerTestProps = WithoutChildrenOrChild<DatePicker.RootProps>;
</script>

<script lang="ts">
	let { placeholder, value, open = false, ...restProps }: DatePickerTestProps = $props();

	function clear() {
		value = undefined;
	}
</script>

<main>
	<div data-testid="value">{String(value)}</div>
	<div data-testid="open">{open}</div>
	<button onclick={clear} data-testid="clear">clear</button>
	<button onclick={() => (open = !open)} data-testid="toggle-open">toggle open</button>
	<DatePicker.Root bind:value bind:placeholder bind:open {...restProps}>
		<DatePicker.Label data-testid="label">Date</DatePicker.Label>
		<DatePicker.Input data-testid="input">
			{#snippet children({ segments })}
				{#each segments as { part, value }, i (i)}
					<DatePicker.Segment {part} data-testid={part === "literal" ? undefined : part}>
						{value}
					</DatePicker.Segment>
				{/each}
			{/snippet}
		</DatePicker.Input>

		<DatePicker.Trigger data-testid="trigger">Open</DatePicker.Trigger>
		<DatePicker.Content data-testid="content">
			<DatePicker.Calendar data-testid="calendar">
				{#snippet children({ months, weekdays })}
					<DatePicker.Header data-testid="header">
						<DatePicker.PrevButton data-testid="prev-button">Prev</DatePicker.PrevButton
						>
						<DatePicker.Heading data-testid="heading" />
						<DatePicker.NextButton data-testid="next-button">Next</DatePicker.NextButton
						>
					</DatePicker.Header>
					<div>
						{#each months as month, i (i)}
							{@const m = month.value.month}
							<DatePicker.Grid data-testid="grid-{m}">
								<DatePicker.GridHead data-testid="grid-head-{m}">
									<DatePicker.GridRow data-testid="grid-row-{m}">
										{#each weekdays as day, i (i)}
											<DatePicker.HeadCell data-testid="weekday-{m}-{i}">
												{day}
											</DatePicker.HeadCell>
										{/each}
									</DatePicker.GridRow>
								</DatePicker.GridHead>
								<DatePicker.GridBody data-testid="grid-body-{m}">
									{#each month.weeks as weekDates, i (i)}
										<DatePicker.GridRow
											data-testid="grid-row-{m}-{i}"
											data-week
										>
											{#each weekDates as date, d (d)}
												<DatePicker.Cell
													{date}
													month={month.value}
													data-testid="cell-{date.month}-{d}"
													class="p-3"
												>
													<DatePicker.Day
														data-testid="date-{date.month}-{date.day}"
														class="p-1"
													>
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
				{/snippet}
			</DatePicker.Calendar>
		</DatePicker.Content>
	</DatePicker.Root>
</main>
