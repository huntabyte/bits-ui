<script lang="ts">
	import { Select } from "bits-ui";
	import "../../app.css";

	let menuItems = $state([
		{ value: "1", label: "A", text: "A" },
		{ value: "2", label: "B", text: "B" },
	]);

	let { value = $bindable(""), open = $bindable(false) } = $props();

	const stopContentEvent = (e: Event) => {
		e.stopPropagation();
	};

	function setValue(nextValue: string) {
		value = nextValue;
	}
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open type="single" items={[]}>
		<Select.Trigger data-testid="trigger">
			<Select.Value placeholder="Pick theme">
				{#snippet children({ selection, placeholder })}
					<span data-testid="selection-label">
						{selection.type === "single" && selection.selected
							? selection.selected.label
							: placeholder}
					</span>
					<span data-testid="selection-value">
						{selection.type === "single" && selection.selected
							? selection.selected.value
							: "none"}
					</span>
				{/snippet}
			</Select.Value>
		</Select.Trigger>
		<Select.Portal>
			<Select.Content data-testid="content">
				<button
					type="button"
					data-testid="set-value-2"
					onpointerdown={stopContentEvent}
					onclick={(e) => {
						stopContentEvent(e);
						setValue("2");
					}}
				>
					set value 2
				</button>
				{#each menuItems as item (item.value)}
					<Select.Item data-testid={item.value} value={item.value} label={item.label}>
						{item.text}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</main>
