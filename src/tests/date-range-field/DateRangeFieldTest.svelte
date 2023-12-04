<script lang="ts">
	import { DateRangeField } from "$lib";

	type $$Props = DateRangeField.Props;
	export let value: $$Props["value"] = undefined;
	export let placeholder: $$Props["placeholder"] = undefined;
</script>

<main>
	<div data-testid="value">{value}</div>
	<div data-testid="start-value">{value?.start}</div>
	<div data-testid="end-value">{value?.end}</div>
	<DateRangeField.Root bind:value bind:placeholder {...$$restProps}>
		<DateRangeField.Label data-testid="label">Hotel dates</DateRangeField.Label>
		<DateRangeField.Input let:segments data-testid="input">
			{#each segments.start as { part, value }}
				<DateRangeField.Segment
					type="start"
					data-testid={part === "literal" ? undefined : `start-${part}`}
					{part}
				>
					{value}
				</DateRangeField.Segment>
			{/each}
			{#each segments.end as { part, value }}
				<DateRangeField.Segment
					type="end"
					data-testid={part === "literal" ? undefined : `end-${part}`}
					{part}
				>
					{value}
				</DateRangeField.Segment>
			{/each}
		</DateRangeField.Input>
	</DateRangeField.Root>
</main>
