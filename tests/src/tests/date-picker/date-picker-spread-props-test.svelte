<script lang="ts">
	import { DatePicker } from "bits-ui";

	// `placeholder` is intentionally not bound, and the spread is reassigned during mount
	// eslint-disable-next-line svelte/prefer-writable-derived -- reproduces the reassignment
	let attrs: Record<string, unknown> = $state({});
	$effect(() => {
		attrs = { closeOnDateSelect: true };
	});
</script>

<DatePicker.Root {...attrs}>
	<DatePicker.Input data-testid="input">
		{#snippet children({ segments })}
			{#each segments as { part, value }, i (i)}
				<DatePicker.Segment {part} data-testid={part}>{value}</DatePicker.Segment>
			{/each}
		{/snippet}
	</DatePicker.Input>
</DatePicker.Root>
