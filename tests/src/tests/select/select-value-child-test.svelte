<script lang="ts" module>
	import { Select, type SelectSingleRootProps, type WithoutChildren } from "bits-ui";
	import { generateTestId } from "../helpers/select";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

export type SelectValueChildTestProps = Omit<WithoutChildren<SelectSingleRootProps>, "type"> & {
		items: Item[];
		placeholder?: string;
	};
</script>

<script lang="ts">
	import "../../app.css";

	let {
		items = [],
		value = "",
		open = false,
		placeholder = "Open Listbox",
		...restProps
	}: SelectValueChildTestProps = $props();
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open items={items} {...restProps} type="single">
		<Select.Trigger data-testid="trigger">
			<Select.Value {placeholder}>
				{#snippet child({ props, selection, placeholder: currentPlaceholder, disabled })}
					<span data-testid="value-node" {...props}>
						<span data-testid="selection-type">{selection.type}</span>
						<span data-testid="selection-value">
							{selection.type === "single" && selection.selected
								? selection.selected.value
								: "none"}
						</span>
						<span data-testid="selection-label">
							{selection.type === "single" && selection.selected
								? selection.selected.label
								: currentPlaceholder}
						</span>
						<span data-testid="selection-disabled">{disabled ? "true" : "false"}</span>
					</span>
					<button
						type="button"
						data-testid="set-value-2"
						onpointerdown={(e) => e.stopPropagation()}
						onclick={(e) => {
							e.stopPropagation();
							if (disabled || selection.type !== "single") return;
							selection.setValue("2");
						}}
					>
						set value
					</button>
				{/snippet}
			</Select.Value>
		</Select.Trigger>

		<Select.Portal>
			<Select.Content data-testid="content">
				<Select.Group>
					{#each items as item (item.value)}
						<Select.Item
							data-testid={generateTestId(item.value)}
							value={item.value}
							label={item.label}
							disabled={item.disabled}
						>
							{item.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</main>
