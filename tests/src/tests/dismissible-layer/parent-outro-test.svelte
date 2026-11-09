<script lang="ts">
	import { DropdownMenu, Popover, Select } from "bits-ui";
	import "../../app.css";

	// A floating layer inside a transitioning `{#if}`, the way a dialog holds one.
	// Closing `shown` pauses the branch for its outro.
	let {
		layer,
		sideOffset = 8,
		onInteractOutside,
		onFocusOutside,
		onOpenChange,
	}: {
		layer: "popover" | "portalled-popover" | "menu" | "select";
		sideOffset?: number;
		onInteractOutside?: (event: PointerEvent) => void;
		onFocusOutside?: (event: FocusEvent) => void;
		onOpenChange?: (open: boolean) => void;
	} = $props();

	let shown = $state(true);
	let open = $state(true);

	function fadeOut(_node: Element) {
		return { duration: 300, css: (t: number) => `opacity: ${t}` };
	}
</script>

<!-- Closes both from a `click()`, so no press reaches the layer. -->
<button
	data-testid="close-both"
	onclick={() => {
		shown = false;
		open = false;
	}}
>
	close both
</button>
<div data-testid="outside">outside</div>

{#if shown}
	<div data-testid="panel" out:fadeOut>
		{#if layer === "popover"}
			<Popover.Root bind:open {onOpenChange}>
				<Popover.Trigger data-testid="trigger">more</Popover.Trigger>
				<Popover.Content
					data-testid="content"
					{sideOffset}
					{onInteractOutside}
					{onFocusOutside}
				>
					body
				</Popover.Content>
			</Popover.Root>
		{:else if layer === "portalled-popover"}
			<Popover.Root bind:open {onOpenChange}>
				<Popover.Trigger data-testid="trigger">more</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content
						data-testid="content"
						{sideOffset}
						{onInteractOutside}
						{onFocusOutside}
					>
						body
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
		{:else if layer === "menu"}
			<DropdownMenu.Root bind:open {onOpenChange}>
				<DropdownMenu.Trigger data-testid="trigger">more</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						data-testid="content"
						{sideOffset}
						{onInteractOutside}
						{onFocusOutside}
					>
						<DropdownMenu.Item>item</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		{:else}
			<Select.Root type="single" bind:open {onOpenChange}>
				<Select.Trigger data-testid="trigger">choose</Select.Trigger>
				<Select.Portal>
					<Select.Content
						data-testid="content"
						{sideOffset}
						{onInteractOutside}
						{onFocusOutside}
					>
						<Select.Viewport>
							<Select.Item value="a" label="a">a</Select.Item>
						</Select.Viewport>
					</Select.Content>
				</Select.Portal>
			</Select.Root>
		{/if}
	</div>
{/if}
