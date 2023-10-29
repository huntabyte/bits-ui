<script lang="ts" context="module">
	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};
</script>

<script lang="ts">
	import { Select } from "$lib";

	type $$Props = Select.Props & {
		items: Item[];
	};
	export let selected: $$Props["selected"] = undefined;
	export let open: $$Props["open"] = false;
	export let items: Item[] = [];
	export let placeholder = "Select something";
</script>

<main data-testid="main">
	<Select.Root bind:selected bind:open {...$$restProps}>
		<Select.Trigger data-testid="trigger" aria-label="open select">
			<Select.Value data-testid="value" {placeholder} />
		</Select.Trigger>
		<Select.Content data-testid="content">
			<Select.Group data-testid="group">
				<Select.Label data-testid="label">Options</Select.Label>
				{#each items as { value, label, disabled }}
					<Select.Item data-testid={value} {disabled} {value} {label}>{label}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
	<div data-testid="outside" />
	<button data-testid="open-binding" on:click={() => (open = !open)}>
		{open}
	</button>
	<button data-testid="selected-binding" on:click={() => (selected = undefined)}>
		{selected}
	</button>
</main>
<div data-testid="portal-target" id="portal-target" />
