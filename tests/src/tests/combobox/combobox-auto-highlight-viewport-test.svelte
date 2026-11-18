<script lang="ts">
	import { Combobox } from "bits-ui";
</script>

<Combobox.Root type="single" autoHighlight>
	<Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
	<Combobox.Input data-testid="input" aria-label="Search" />
	<Combobox.Portal>
		<Combobox.Content data-testid="content">
			<Combobox.Viewport data-testid="viewport" style="height: 96px; max-height: 96px;">
				{#each Array.from({ length: 20 }, (_, i) => i) as i (i)}
					<Combobox.Item
						value={String(i)}
						label="Banana {i}"
						data-testid="item-{i}"
						style="height: 32px;"
					>
						Banana {i}
					</Combobox.Item>
				{/each}
			</Combobox.Viewport>
		</Combobox.Content>
	</Combobox.Portal>
</Combobox.Root>
