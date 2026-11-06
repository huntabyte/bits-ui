<script lang="ts" module>
	import { DropdownMenu } from "bits-ui";
	export type DropdownMenuScrollPaddingTestProps = {
		contentProps?: Omit<DropdownMenu.ContentProps, "children" | "child">;
	};
</script>

<script lang="ts">
	let { contentProps = {} }: DropdownMenuScrollPaddingTestProps = $props();
	const rows = Array.from({ length: 80 }, (_, i) => i + 1);
</script>

<svelte:head>
	<style>
		:root {
			scroll-padding-top: 200px;
		}
	</style>
</svelte:head>

<div data-testid="page">
	{#each rows as row, i (i)}
		<div style="height: 24px;">Row {row}</div>
	{/each}

	<DropdownMenu.Root>
		<DropdownMenu.Trigger data-testid="trigger">Open</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content {...contentProps} data-testid="content" preventScroll={false}>
				<DropdownMenu.Item data-testid="item-1">Item 1</DropdownMenu.Item>
				<DropdownMenu.Item data-testid="item-2">Item 2</DropdownMenu.Item>
				<DropdownMenu.Item data-testid="item-3">Item 3</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>

	{#each rows as row, i (i)}
		<div style="height: 24px;">After row {row}</div>
	{/each}
</div>
