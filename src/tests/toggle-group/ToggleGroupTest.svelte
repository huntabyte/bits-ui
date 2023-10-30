<script lang="ts" context="module">
	export type Item = {
		value: string;
		disabled?: boolean;
	};
</script>

<script lang="ts">
	import { ToggleGroup } from "$lib";

	type $$Props = ToggleGroup.Props<"single"> & {
		items: Item[];
	};
	export let value: $$Props["value"] = undefined;
	export let items: $$Props["items"] = [];
</script>

<main>
	<button data-testid="binding" on:click={() => (value = "4")}>{value}</button>
	<ToggleGroup.Root data-testid="root" bind:value {...$$restProps}>
		{#each items as { value, disabled }}
			<ToggleGroup.Item {value} {disabled} data-testid="item-{value}">
				{value}
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
</main>
