<script lang="ts" context="module">
	import { DateField, type DateFieldRootProps, type WithoutChildrenOrChild } from "$lib/index.js";
	export type DateFieldTestProps = WithoutChildrenOrChild<DateFieldRootProps>;
</script>

<script lang="ts">
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
