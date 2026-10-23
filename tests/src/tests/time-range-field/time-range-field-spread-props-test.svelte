<script lang="ts">
	import { TimeRangeField } from "bits-ui";

	// `placeholder` is intentionally not bound, and the spread is reassigned during mount
	// eslint-disable-next-line svelte/prefer-writable-derived -- reproduces the reassignment
	let attrs: Record<string, unknown> = $state({ "data-testid": "root" });
	$effect(() => {
		attrs = { "data-testid": "root", "data-updated": "" };
	});
</script>

<TimeRangeField.Root {...attrs}>
	{#each ["start", "end"] as const as type (type)}
		<TimeRangeField.Input {type}>
			{#snippet children({ segments })}
				{#each segments as { part, value }, i (i)}
					<TimeRangeField.Segment {part} data-testid="{type}-{part}">
						{value}
					</TimeRangeField.Segment>
				{/each}
			{/snippet}
		</TimeRangeField.Input>
	{/each}
</TimeRangeField.Root>
