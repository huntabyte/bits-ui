<script lang="ts" module>
	import { Select } from "bits-ui";

	export type SelectExternalValueTestProps = {
		type: "single" | "multiple";
		value: string | string[];
		/** Mounts another item with value "3" (a duplicate) alongside the change. */
		extra?: boolean;
	};
</script>

<script lang="ts">
	import "../../app.css";

	let { type, value, extra = false }: SelectExternalValueTestProps = $props();
	const items = ["1", "2", "3", "4"].map((v) => ({ value: v, label: `Item ${v}` }));
</script>

{#snippet list()}
	<Select.Portal>
		<Select.Content data-testid="content">
			{#each items as item (item.value)}
				<Select.Item value={item.value} label={item.label} data-testid={item.value}>
					{#snippet children({ selected })}{item.label}{selected ? " ✓" : ""}{/snippet}
				</Select.Item>
			{/each}
			{#if extra}
				<Select.Item value="3" label="Item 3 again" data-testid="extra-3">again</Select.Item>
			{/if}
		</Select.Content>
	</Select.Portal>
{/snippet}

{#if type === "single"}
	<Select.Root type="single" open value={value as string} {items}>
		<Select.Trigger data-testid="trigger">open</Select.Trigger>
		{@render list()}
	</Select.Root>
{:else}
	<Select.Root type="multiple" open value={value as string[]} {items}>
		<Select.Trigger data-testid="trigger">open</Select.Trigger>
		{@render list()}
	</Select.Root>
{/if}
