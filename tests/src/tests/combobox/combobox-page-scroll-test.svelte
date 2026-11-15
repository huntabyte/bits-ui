<script lang="ts">
	import "../../app.css";
	import { Combobox } from "bits-ui";

	const items = Array.from({ length: 30 }, (_, i) => ({ value: `${i}`, label: `Item ${i}` }));
</script>

<div style="height: 900px;"></div>
<Combobox.Root type="single" {items}>
	<Combobox.Input data-testid="input" aria-label="open combobox" />
	<Combobox.Portal>
		<Combobox.Content
			data-testid="content"
			preventScroll={false}
			side="bottom"
			avoidCollisions={false}
			style="max-height: 200px; display: flex; flex-direction: column; background: white;"
		>
			<Combobox.Viewport data-testid="viewport">
				{#each items as item (item.value)}
					<Combobox.Item value={item.value} label={item.label} data-testid={item.value}>
						{item.label}
					</Combobox.Item>
				{/each}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
<div style="height: 2000px;"></div>
