<script lang="ts" context="module">
	export type DateRangeFieldTestProps = WithoutChildren<DateRangeFieldRootProps>;
</script>

<script lang="ts">
	import {
		DateRangeField,
		type DateRangeFieldRootProps,
		type WithoutChildren,
	} from "$lib/index.js";
	let { value, placeholder, ...restProps }: DateRangeFieldTestProps = $props();
</script>

<main>
	<div data-testid="value">{value}</div>
	<div data-testid="start-value">{value?.start}</div>
	<div data-testid="end-value">{value?.end}</div>
	<DateRangeField.Root bind:value bind:placeholder {...restProps} data-testid="root">
		<DateRangeField.Label data-testid="label">Label</DateRangeField.Label>
		{#each ["start", "end"] as const as type}
			<DateRangeField.Input data-testid="{type}-input" {type}>
				{#snippet children({ segments })}
					{#each segments as { part, value }}
						<DateRangeField.Segment
							{part}
							data-testid={part === "literal" ? undefined : `${type}-${part}`}
						>
							{value}
						</DateRangeField.Segment>
					{/each}
				{/snippet}
			</DateRangeField.Input>
		{/each}
	</DateRangeField.Root>
</main>
