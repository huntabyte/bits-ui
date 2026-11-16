<script lang="ts">
	import { BitsConfig, ContextMenu, DropdownMenu, Menubar, type Direction } from "bits-ui";

	let {
		kind = "dropdown",
		dir,
		nestedDir,
		componentDir,
		side,
		forceMount = false,
	}: {
		kind?: "dropdown" | "context" | "menubar";
		dir?: Direction;
		nestedDir?: Direction;
		componentDir?: Direction;
		side?: DropdownMenu.SubContentProps["side"];
		forceMount?: boolean;
	} = $props();

	const menu = $derived(
		kind === "menubar" ? Menubar : kind === "context" ? ContextMenu : DropdownMenu
	);
</script>

<BitsConfig {dir}>
	<BitsConfig dir={nestedDir}>
		<div data-testid="menu-container">
			{#if kind === "menubar"}
				<Menubar.Root dir={componentDir}>
					<Menubar.Menu>{@render parts()}</Menubar.Menu>
				</Menubar.Root>
			{:else if kind === "context"}
				<ContextMenu.Root dir={componentDir}>{@render parts()}</ContextMenu.Root>
			{:else}
				<DropdownMenu.Root dir={componentDir}>{@render parts()}</DropdownMenu.Root>
			{/if}
		</div>
	</BitsConfig>
</BitsConfig>

{#snippet parts()}
	<menu.Trigger data-testid="trigger" style="position: fixed; left: 50vw; top: 100px;">
		Open menu
	</menu.Trigger>
	<menu.Portal>
		<menu.Content data-testid="content" style="width: 120px;" avoidCollisions={false}>
			<menu.Sub>
				<menu.SubTrigger data-testid="sub-trigger">Submenu</menu.SubTrigger>
				<menu.Portal>
					<menu.SubContent
						data-testid="sub-content"
						{side}
						{forceMount}
						style="width: 100px;"
						avoidCollisions={false}
					>
						<menu.Item data-testid="sub-item">Submenu item</menu.Item>
					</menu.SubContent>
				</menu.Portal>
			</menu.Sub>
		</menu.Content>
	</menu.Portal>
{/snippet}
