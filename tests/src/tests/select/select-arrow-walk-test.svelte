<script lang="ts" module>
	import { Select } from "bits-ui";

	export type SelectArrowWalkTestProps = {
		/** Groups of items; a `!` prefix marks an item disabled. */
		groups: string[][];
		loop: boolean;
	};
</script>

<script lang="ts">
	import "../../app.css";

	let { groups, loop }: SelectArrowWalkTestProps = $props();
	const parse = (raw: string) => ({ value: raw.replace("!", ""), disabled: raw.startsWith("!") });
</script>

<Select.Root type="single" {loop}>
	<Select.Trigger data-testid="trigger">open</Select.Trigger>
	<Select.Portal>
		<Select.Content data-testid="content">
			{#each groups as group, g (g)}
				<Select.Group>
					<Select.GroupHeading>group {g}</Select.GroupHeading>
					{#each group.map(parse) as item (item.value)}
						<Select.Item
							value={item.value}
							disabled={item.disabled}
							data-testid={item.value}
						>
							<span>{item.value}</span>
						</Select.Item>
					{/each}
				</Select.Group>
			{/each}
		</Select.Content>
	</Select.Portal>
</Select.Root>
