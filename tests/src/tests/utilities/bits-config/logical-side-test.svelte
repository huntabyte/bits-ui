<script lang="ts">
	import {
		BitsConfig,
		Popover,
		DropdownMenu,
		ContextMenu,
		Menubar,
		type Direction,
	} from "bits-ui";

	let {
		kind = "popover",
		dir,
		nestedDir,
		componentDir,
		side = "inline-end",
		forceMount = false,
		avoidCollisions = false,
		edge,
	}: {
		kind?: "popover" | "dropdown" | "context" | "menubar";
		dir?: Direction;
		nestedDir?: Direction;
		componentDir?: Direction;
		side?: Popover.ContentProps["side"];
		forceMount?: boolean;
		avoidCollisions?: boolean;
		edge?: "left" | "right";
	} = $props();
	const menu = $derived(
		kind === "menubar" ? Menubar : kind === "context" ? ContextMenu : DropdownMenu
	);
	const triggerStyle = $derived(
		`position: fixed; top: 150px; ${edge === "right" ? "right: 4px" : edge === "left" ? "left: 4px" : "left: 50vw"}; width: 100px; height: 30px;`
	);
</script>

<BitsConfig {dir}>
	<BitsConfig dir={nestedDir}>
		<div data-testid="container">
			{#if kind === "popover"}
				<Popover.Root>
					<Popover.Trigger data-testid="trigger" style={triggerStyle}
						>Open</Popover.Trigger
					>
					<Popover.Portal>
						<Popover.Content
							data-testid="content"
							{side}
							{forceMount}
							{avoidCollisions}
							dir={componentDir}
							style="width: 100px; height: 60px;"
						>
							<Popover.Arrow data-testid="arrow" />
							Content
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
			{:else if kind === "menubar"}
				<Menubar.Root dir={componentDir}>
					<Menubar.Menu>{@render menuParts()}</Menubar.Menu>
				</Menubar.Root>
			{:else if kind === "context"}
				<ContextMenu.Root dir={componentDir}>{@render menuParts()}</ContextMenu.Root>
			{:else}
				<DropdownMenu.Root dir={componentDir}>{@render menuParts()}</DropdownMenu.Root>
			{/if}
		</div>
	</BitsConfig>
</BitsConfig>

{#snippet menuParts()}
	<menu.Trigger data-testid="trigger" style={triggerStyle}>Open</menu.Trigger>
	<menu.Portal>
		<menu.Content avoidCollisions={false} style="width: 100px;">
			<menu.Sub>
				<menu.SubTrigger data-testid="sub-trigger">Submenu</menu.SubTrigger>
				<menu.Portal>
					<menu.SubContent
						data-testid="content"
						{side}
						{forceMount}
						{avoidCollisions}
						style="width: 100px; height: 60px;"
					>
						<menu.Arrow data-testid="arrow" />
						<menu.Item data-testid="sub-item">Item</menu.Item>
					</menu.SubContent>
				</menu.Portal>
			</menu.Sub>
		</menu.Content>
	</menu.Portal>
{/snippet}
