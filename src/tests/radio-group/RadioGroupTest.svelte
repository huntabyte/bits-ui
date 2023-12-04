<script lang="ts" context="module">
	export type Item = {
		value: string;
		disabled: boolean;
	};
</script>

<script lang="ts">
	import { RadioGroup } from "$lib";

	type $$Props = RadioGroup.Props & {
		items: Item[];
	};
	export let value: $$Props["value"] = "";
	export let items: Item[] = [];
</script>

<main>
	<RadioGroup.Root data-testid="root" bind:value {...$$restProps}>
		{#each items as { value, disabled }}
			<RadioGroup.Item {value} {disabled} data-testid="{value}-item">
				<RadioGroup.ItemIndicator>
					<span data-testid="{value}-indicator"> checked </span>
				</RadioGroup.ItemIndicator>
				{value}
			</RadioGroup.Item>
		{/each}
		<RadioGroup.Input data-testid="input" />
	</RadioGroup.Root>
	<button
		aria-label="binding"
		data-testid="binding"
		on:click={() => (value = items[0].value)}>{value}</button
	>
</main>
