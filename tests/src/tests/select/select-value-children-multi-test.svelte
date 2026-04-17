<script lang="ts" module>
	import { Select, type SelectMultipleRootProps, type WithoutChildren } from "bits-ui";
	import { generateTestId } from "../helpers/select";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

export type SelectValueChildrenMultiTestProps = Omit<
	WithoutChildren<SelectMultipleRootProps>,
	"type"
> & {
		items: Item[];
		placeholder?: string;
	};
</script>

<script lang="ts">
	import "../../app.css";

	let {
		items = [],
		value = [],
		open = false,
		placeholder = "Open combobox",
		...restProps
	}: SelectValueChildrenMultiTestProps = $props();
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open items={items} {...restProps} type="multiple">
		<Select.Trigger data-testid="trigger">
			<Select.Value {placeholder}>
				{#snippet children({ selection, placeholder: currentPlaceholder, disabled })}
					<span data-testid="selection-type">{selection.type}</span>
					<span data-testid="selection-values">
						{selection.type === "multiple" && selection.selected.length > 0
							? selection.selected.map((v) => v.value).join(",")
							: "none"}
					</span>
					<span data-testid="selection-label">
						{selection.type === "multiple" && selection.selected.length > 0
							? selection.selected.map((v) => v.label).join(", ")
							: currentPlaceholder}
					</span>
					<span data-testid="selection-disabled">{disabled ? "true" : "false"}</span>
					<button
						type="button"
						data-testid="set-values-1-3"
						onpointerdown={(e) => e.stopPropagation()}
						onclick={(e) => {
							e.stopPropagation();
							if (disabled || selection.type !== "multiple") return;
							selection.setValue(["1", "3"]);
						}}
					>
						set values
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
