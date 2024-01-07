<script lang="ts" context="module">
	export type Item = {
		value: unknown;
		label: string;
		disabled?: boolean;
	};
</script>

<script lang="ts">
	import { Combobox } from "$lib";

	type $$Props = Combobox.Props<unknown> & {
		options: Item[];
	};

	export let inputValue: $$Props["inputValue"] = undefined;
	export let selected: $$Props["selected"] = undefined;
	export let open: $$Props["open"] = false;
	export let options: Item[] = [];
	export let placeholder = "Select something";
</script>

<main data-testid="main">
	<Combobox.Root bind:selected bind:open bind:inputValue {...$$restProps}>
		<Combobox.Content data-testid="content" aria-label="open combobox">
			<Combobox.Input data-testid="input" {placeholder} />
		</Combobox.Content>
		<Combobox.Menu data-testid="menu">
			<Combobox.Group data-testid="group">
				<Combobox.GroupLabel data-testid="group-label">Options</Combobox.GroupLabel>
				{#each options as { value, label, disabled }}
					<Combobox.Item data-testid={value} {disabled} {value} {label}>
						<Combobox.ItemIndicator>
							<span data-testid="{value}-indicator">x</span>
						</Combobox.ItemIndicator>
						{label}
					</Combobox.Item>
				{/each}
			</Combobox.Group>
		</Combobox.Menu>
		<Combobox.HiddenInput data-testid="hidden-input" />
	</Combobox.Root>
	<div data-testid="outside" />
	<button data-testid="input-binding" on:click={() => (inputValue = "")}>
		{#if inputValue === ""}
			empty
		{:else}
			{inputValue}
		{/if}
	</button>
	<button data-testid="open-binding" on:click={() => (open = !open)}>
		{open}
	</button>
	<button data-testid="selected-binding" on:click={() => (selected = undefined)}>
		{#if selected === undefined}
			undefined
		{:else}
			{selected.label} - {selected.value}
		{/if}
	</button>
</main>
<div data-testid="portal-target" id="portal-target" />
