<script lang="ts">
	import { Select } from "bits-ui";
	import "../../app.css";

	let menuItems = $state([
		{ value: "1", label: "A", text: "A" },
		{ value: "2", label: "B", text: "B" },
		{ value: "empty-label", label: "", text: "Visible fallback" },
	]);

	let { value = $bindable([]), open = $bindable(false) } = $props();

	function updateFirstLabel() {
		const item = menuItems[0];
		if (!item) return;
		item.label = "A updated";
		item.text = "A updated";
	}

	const stopTriggerEvent = (e: Event) => {
		e.stopPropagation();
	};

	function setValues(values: string[]) {
		value = values;
	}

	const controlButtons = [
		{ testId: "set-values-1", label: "set values 1", values: ["1"] },
		{ testId: "set-values-2", label: "set values 2", values: ["2"] },
		{
			testId: "set-values-empty-label",
			label: "set empty label",
			values: ["empty-label"],
		},
	];
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open type="multiple" items={[]}>
		<Select.Trigger data-testid="trigger">
			<Select.Value placeholder="Pick themes">
				{#snippet children({ selection, placeholder })}
					<span data-testid="selection-label">
						{selection.type === "multiple" && selection.selected.length > 0
							? selection.selected.map((v) => v.label).join(", ")
							: placeholder}
					</span>
					<span data-testid="selection-values">
						{selection.type === "multiple" && selection.selected.length > 0
							? selection.selected.map((v) => v.value).join(",")
							: "none"}
					</span>
				{/snippet}
			</Select.Value>
		</Select.Trigger>
		<Select.Portal>
			<Select.Content data-testid="content">
				<div>
					{#each controlButtons as button (button.testId)}
						<button
							type="button"
							data-testid={button.testId}
							onpointerdown={stopTriggerEvent}
							onclick={(e) => {
								stopTriggerEvent(e);
								setValues(button.values);
							}}
						>
							{button.label}
						</button>
					{/each}
					<button
						type="button"
						data-testid="clear-values"
						onpointerdown={stopTriggerEvent}
						onclick={(e) => {
							stopTriggerEvent(e);
							setValues([]);
						}}
					>
						clear values
					</button>
					<button
						type="button"
						data-testid="update-label-1"
						onpointerdown={stopTriggerEvent}
						onclick={(e) => {
							stopTriggerEvent(e);
							updateFirstLabel();
						}}
					>
						update label
					</button>
				</div>
				{#each menuItems as item (item.value)}
					<Select.Item data-testid={item.value} value={item.value} label={item.label}>
						{item.text}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</main>
