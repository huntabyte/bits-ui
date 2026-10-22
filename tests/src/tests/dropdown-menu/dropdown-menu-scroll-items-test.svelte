<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let { onSelect }: { onSelect: (i: number) => void } = $props();
	const rows = Array.from({ length: 30 }, (_, i) => i);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger data-testid="trigger">Open</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			data-testid="content"
			preventScroll={false}
			style="height: 200px; overflow-y: auto; width: 200px;"
		>
			{#each rows as i (i)}
				<DropdownMenu.Item
					data-testid="item-{i}"
					style="height: 40px;"
					onSelect={() => onSelect(i)}>Item {i}</DropdownMenu.Item
				>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
