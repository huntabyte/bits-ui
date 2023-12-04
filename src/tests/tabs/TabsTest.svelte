<script lang="ts" context="module">
	export type Item = {
		value: string;
		disabled: boolean;
	};
</script>

<script lang="ts">
	import { Tabs } from "$lib";

	type $$Props = Tabs.Props & {
		items?: Item[];
	};
	export let value: $$Props["value"] = undefined;
	export let items: Item[] = [];
</script>

<main>
	<Tabs.Root
		aria-label="airplane mode"
		data-testid="root"
		bind:value
		{...$$restProps}
	>
		<Tabs.List data-testid="list">
			{#each items as { value, disabled }}
				<Tabs.Trigger {value} {disabled} data-testid="trigger-{value}">
					{value}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		{#each items as { value }}
			<Tabs.Content {value} data-testid="content-{value}">
				{value}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
	<button data-testid="binding" on:click={() => (value = undefined)}
		>{value}</button
	>
</main>
