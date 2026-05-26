<script lang="ts" module>
	import {
		Select,
		type SelectSingleRootProps,
		type WithoutChildren,
		type WithoutChildrenOrChild,
	} from "bits-ui";
	import { generateTestId } from "../helpers/select";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type SelectItemAlignedTestProps = WithoutChildren<SelectSingleRootProps> & {
		contentProps?: WithoutChildrenOrChild<Select.ContentProps>;
		items: Item[];
	};
</script>

<script lang="ts">
	import "../../app.css";

	let {
		contentProps,
		items,
		value = $bindable(""),
		open = $bindable(false),
		...restProps
	}: SelectItemAlignedTestProps = $props();

	const selectedLabel = $derived(
		value ? items.find((item) => item.value === value)?.label : "Open Listbox"
	);
</script>

<main data-testid="main">
	<Select.Root bind:value bind:open {...restProps} type="single">
		<Select.Trigger data-testid="trigger" style="display: inline-block; width: 200px;">
			{selectedLabel}
		</Select.Trigger>
		<Select.Portal>
			<Select.Content
				data-testid="content"
				{...contentProps}
				position="item-aligned"
			>
				<Select.Viewport data-testid="viewport">
					{#each items as { value, label, disabled } (value)}
						{@const testId = generateTestId(value)}
						<Select.Item data-testid={testId} {disabled} {value} {label}>
							{#snippet children({ selected })}
								{#if selected}
									<span data-testid="{testId}-indicator">✓</span>
								{/if}
								{label}
							{/snippet}
						</Select.Item>
					{/each}
				</Select.Viewport>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
	<div data-testid="outside" style="position: fixed; top: 10px; right: 10px;">outside</div>
	<button data-testid="open-binding" onclick={() => (open = !open)}>{open}</button>
	<button data-testid="value-binding" onclick={() => (value = "")}>{value || "empty"}</button>
</main>
