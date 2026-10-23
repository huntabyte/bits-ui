<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let { count, openIndex = -1 }: { count: number; openIndex?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<DateRangePicker.Root open={openIndex === i}>
		<DateRangePicker.Label>label</DateRangePicker.Label>
		{#each ["start", "end"] as const as type (type)}
			<DateRangePicker.Input {type}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, s (s)}
						<DateRangePicker.Segment {part}>{value}</DateRangePicker.Segment>
					{/each}
				{/snippet}
			</DateRangePicker.Input>
		{/each}
		<DateRangePicker.Trigger data-bench="trigger">open</DateRangePicker.Trigger>
			<DateRangePicker.Content data-bench="content">
				<DateRangePicker.Calendar>
					{#snippet children({ months, weekdays })}
						<DateRangePicker.Header>
							<DateRangePicker.PrevButton>prev</DateRangePicker.PrevButton>
							<DateRangePicker.Heading />
							<DateRangePicker.NextButton>next</DateRangePicker.NextButton>
						</DateRangePicker.Header>
						{#each months as m (m.value.toString())}
							<DateRangePicker.Grid>
								<DateRangePicker.GridHead>
									<DateRangePicker.GridRow>
										{#each weekdays as day, d (d)}
											<DateRangePicker.HeadCell>{day}</DateRangePicker.HeadCell>
										{/each}
									</DateRangePicker.GridRow>
								</DateRangePicker.GridHead>
								<DateRangePicker.GridBody>
									{#each m.weeks as week, w (w)}
										<DateRangePicker.GridRow>
											{#each week as date (date.toString())}
												<DateRangePicker.Cell {date} month={m.value}>
													<DateRangePicker.Day />
												</DateRangePicker.Cell>
											{/each}
										</DateRangePicker.GridRow>
									{/each}
								</DateRangePicker.GridBody>
							</DateRangePicker.Grid>
						{/each}
					{/snippet}
				</DateRangePicker.Calendar>
			</DateRangePicker.Content>
	</DateRangePicker.Root>
{/each}
