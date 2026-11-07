<script lang="ts">
	import { DatePicker } from "bits-ui";
	let { count, openIndex = -1 }: { count: number; openIndex?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<DatePicker.Root open={openIndex === i}>
		<DatePicker.Label>label</DatePicker.Label>
		<DatePicker.Input>
			{#snippet children({ segments })}
				{#each segments as { part, value }, s (s)}
					<DatePicker.Segment {part}>{value}</DatePicker.Segment>
				{/each}
			{/snippet}
		</DatePicker.Input>
		<DatePicker.Trigger data-bench="trigger">open</DatePicker.Trigger>
		<DatePicker.Portal>
			<DatePicker.Content data-bench="content">
				<DatePicker.Calendar>
					{#snippet children({ months, weekdays })}
						<DatePicker.Header>
							<DatePicker.PrevButton>prev</DatePicker.PrevButton>
							<DatePicker.Heading />
							<DatePicker.NextButton>next</DatePicker.NextButton>
						</DatePicker.Header>
						{#each months as m (m.value.toString())}
							<DatePicker.Grid>
								<DatePicker.GridHead>
									<DatePicker.GridRow>
										{#each weekdays as day, d (d)}
											<DatePicker.HeadCell>{day}</DatePicker.HeadCell>
										{/each}
									</DatePicker.GridRow>
								</DatePicker.GridHead>
								<DatePicker.GridBody>
									{#each m.weeks as week, w (w)}
										<DatePicker.GridRow>
											{#each week as date (date.toString())}
												<DatePicker.Cell {date} month={m.value}>
													<DatePicker.Day />
												</DatePicker.Cell>
											{/each}
										</DatePicker.GridRow>
									{/each}
								</DatePicker.GridBody>
							</DatePicker.Grid>
						{/each}
					{/snippet}
				</DatePicker.Calendar>
			</DatePicker.Content>
		</DatePicker.Portal>
	</DatePicker.Root>
{/each}
