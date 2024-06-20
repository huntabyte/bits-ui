<script lang="ts" context="module">
	export type DateFieldTestProps = WithoutChildren<DateFieldRootProps>;
</script>

<script lang="ts">
	import { DateField, type DateFieldRootProps, type WithoutChildren } from "$lib/index.js";
	let { value, placeholder, ...restProps }: DateFieldTestProps = $props();
</script>

<main>
	<div data-testid="value">{value}</div>
	<DateField.Root bind:value bind:placeholder {...restProps}>
		<div>
			<DateField.Label data-testid="label">Label</DateField.Label>
			<DateField.Input data-testid="input">
				{#snippet children({ segments })}
					{#each segments as { part, value }}
						<DateField.Segment
							{part}
							data-testid={part === "literal" ? undefined : part}
						>
							{value}
						</DateField.Segment>
					{/each}
				{/snippet}
			</DateField.Input>
		</div>
	</DateField.Root>
</main>
