<script lang="ts" module>
	import { Select, type SelectSingleRootProps, type WithoutChildren } from "bits-ui";
	import { generateTestId } from "../helpers/select";

	export type Item = {
		value: string;
		label: string;
		disabled?: boolean;
	};

	export type SelectViewportHighlightTestProps = WithoutChildren<SelectSingleRootProps> & {
		items: Item[];
	};
</script>

<script lang="ts">
	import "../../app.css";

	let {
		items,
		value = "",
		open = false,
		...restProps
	}: SelectViewportHighlightTestProps = $props();
</script>

<Select.Root bind:value bind:open {...restProps} type="single">
	<Select.Trigger data-testid="trigger">Open Listbox</Select.Trigger>
	<Select.Portal>
		<Select.Content data-testid="content">
			<Select.Viewport data-testid="viewport">
				{#each items as { value, label, disabled } (value)}
					{@const testId = generateTestId(value)}
					<Select.Item {disabled} {value} {label} data-testid={testId}>
						{label}
					</Select.Item>
				{/each}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
