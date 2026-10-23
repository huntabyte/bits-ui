<script lang="ts">
	import { DateRangePicker } from "bits-ui";

	// `placeholder` is intentionally not bound, and the spread is reassigned during mount
	// eslint-disable-next-line svelte/prefer-writable-derived -- reproduces the reassignment
	let attrs: Record<string, unknown> = $state({ "data-testid": "root" });
	$effect(() => {
		attrs = { "data-testid": "root", "data-updated": "" };
	});
</script>

<DateRangePicker.Root {...attrs}>
	{#each ["start", "end"] as const as type (type)}
		<DateRangePicker.Input {type}>
			{#snippet children({ segments })}
				{#each segments as { part, value }, i (i)}
					<DateRangePicker.Segment {part} data-testid="{type}-{part}">
						{value}
					</DateRangePicker.Segment>
				{/each}
			{/snippet}
		</DateRangePicker.Input>
	{/each}
</DateRangePicker.Root>
