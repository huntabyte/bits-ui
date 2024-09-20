<script lang="ts" module>
	import type { SingleToggleGroupRootProps, WithoutChildrenOrChild } from "$lib/index.js";
	import { ToggleGroup } from "$lib/index.js";
	export type Item = {
		value: string;
		disabled?: boolean;
	};

	export type SingleToggleGroupTestProps = WithoutChildrenOrChild<SingleToggleGroupRootProps> & {
		items: Item[];
	};
</script>

<script lang="ts">
	let { value = "", items, ...restProps }: SingleToggleGroupTestProps = $props();
</script>

<main>
	<button data-testid="binding" aria-label="binding" onclick={() => (value = "4")}>
		{value}
	</button>
	<ToggleGroup.Root data-testid="root" bind:value {...restProps} type="single">
		{#each items as { value, disabled }}
			<ToggleGroup.Item {value} {disabled} data-testid="item-{value}">
				{value}
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
</main>
