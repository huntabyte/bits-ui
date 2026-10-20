<script lang="ts">
	import { TimeField } from "bits-ui";

	// `placeholder` is intentionally not bound, and the spread is reassigned during mount
	// eslint-disable-next-line svelte/prefer-writable-derived -- reproduces the reassignment
	let attrs: Record<string, unknown> = $state({});
	$effect(() => {
		attrs = { hideTimeZone: true };
	});
</script>

<TimeField.Root {...attrs}>
	<TimeField.Input data-testid="input">
		{#snippet children({ segments })}
			{#each segments as { part, value }, i (i)}
				<TimeField.Segment {part} data-testid={part}>{value}</TimeField.Segment>
			{/each}
		{/snippet}
	</TimeField.Input>
</TimeField.Root>
