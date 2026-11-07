<script lang="ts" module>
	import { Select } from "bits-ui";

	export type SelectUnkeyedItemsTestProps = {
		values: string[];
	};
</script>

<script lang="ts">
	import "../../app.css";

	let { values }: SelectUnkeyedItemsTestProps = $props();
	let value = $state("a");
	let observed = $state("");
	const getSelected: Record<string, () => boolean> = {};
</script>

<!-- reads item "a"'s `selected` in the same handler that moves the value away from it -->
<button
	data-testid="select-b"
	onclick={() => {
		value = "b";
		observed = String(getSelected.a?.());
	}}
>
	select b
</button>
<span data-testid="observed">{observed}</span>

<Select.Root bind:value type="single" open>
	<Select.Trigger data-testid="trigger">open</Select.Trigger>
	<Select.Portal>
		<Select.Content data-testid="content">
			<!-- unkeyed on purpose: the item instances keep their DOM and swap values -->
			{#each values as v}
				<Select.Item value={v} label={v}>
					{#snippet children({ selected })}
						<span
							{@attach () => {
								getSelected[v] = () => selected;
							}}
						>
							{v}
						</span>
					{/snippet}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Portal>
</Select.Root>
