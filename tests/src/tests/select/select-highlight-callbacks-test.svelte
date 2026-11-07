<script lang="ts" module>
	import { Select } from "bits-ui";

	export type SelectHighlightCallbacksTestProps = {
		items: { value: string; label: string }[];
		onLog: (entry: string) => void;
	};
</script>

<script lang="ts">
	import "../../app.css";

	let { items, onLog }: SelectHighlightCallbacksTestProps = $props();
	let value = $state("");
</script>

<Select.Root bind:value type="single" {items}>
	<Select.Trigger data-testid="trigger">Open Listbox</Select.Trigger>
	<Select.Portal>
		<Select.Content data-testid="content">
			{#each items as item (item.value)}
				<Select.Item
					value={item.value}
					label={item.label}
					data-testid={item.value}
					onHighlight={() => onLog(`h:${item.value}`)}
					onUnhighlight={() => onLog(`u:${item.value}`)}
				>
					{item.label}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Portal>
</Select.Root>
