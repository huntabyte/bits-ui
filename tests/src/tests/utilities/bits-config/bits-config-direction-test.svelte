<script lang="ts">
	import {
		BitsConfig,
		ContextMenu,
		DropdownMenu,
		Menubar,
		NavigationMenu,
		Popover,
		ScrollArea,
		Slider,
		type Direction,
	} from "bits-ui";
	import DirectionProbe from "./direction-probe.svelte";

	let {
		dir = "rtl",
		componentDir,
		nestedDir,
		showFloating = true,
	}: {
		dir?: Direction;
		componentDir?: Direction;
		nestedDir?: Direction;
		showFloating?: boolean;
	} = $props();
</script>

<DirectionProbe id="outside" />
<Slider.Root type="single" value={50} data-testid="fallback-slider" />
<BitsConfig {dir} defaultLocale="ar">
	<DirectionProbe id="parent" />
	<BitsConfig>
		<DirectionProbe id="inherited" />
		<Slider.Root type="single" value={50} dir={componentDir} data-testid="slider">
			<Slider.Thumb index={0} data-testid="thumb" />
		</Slider.Root>
		<Menubar.Root dir={componentDir} loop={false} data-testid="menubar">
			<Menubar.Menu value="first"
				><Menubar.Trigger data-testid="first-menu">First</Menubar.Trigger></Menubar.Menu
			>
			<Menubar.Menu value="second"
				><Menubar.Trigger data-testid="second-menu">Second</Menubar.Trigger></Menubar.Menu
			>
		</Menubar.Root>
		<NavigationMenu.Root dir={componentDir} data-testid="navigation-menu" />
		<ScrollArea.Root dir={componentDir} data-testid="scroll-area" />
		{#if showFloating}
			<DropdownMenu.Root open dir={componentDir}>
				<DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						trapFocus={false}
						onOpenAutoFocus={(e) => e.preventDefault()}
						data-testid="dropdown-menu"
						><DropdownMenu.Item>Item</DropdownMenu.Item></DropdownMenu.Content
					>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
			<ContextMenu.Root open dir={componentDir}>
				<ContextMenu.Trigger>Context menu</ContextMenu.Trigger>
				<ContextMenu.Portal>
					<ContextMenu.Content
						trapFocus={false}
						onOpenAutoFocus={(e) => e.preventDefault()}
						data-testid="context-menu"
						><ContextMenu.Item>Item</ContextMenu.Item></ContextMenu.Content
					>
				</ContextMenu.Portal>
			</ContextMenu.Root>
			<Popover.Root open>
				<Popover.Trigger>Popover</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content
						trapFocus={false}
						onOpenAutoFocus={(e) => e.preventDefault()}
						dir={componentDir}
						data-testid="popover">Content</Popover.Content
					>
				</Popover.Portal>
			</Popover.Root>
		{/if}
	</BitsConfig>
	<BitsConfig dir={nestedDir}>
		<DirectionProbe id="nested" />
	</BitsConfig>
</BitsConfig>
