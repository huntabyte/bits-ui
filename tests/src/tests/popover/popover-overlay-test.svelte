<script lang="ts" module>
	import { Popover } from "bits-ui";
	export type PopoverOverlayTestProps = Popover.RootProps & {
		overlayProps?: Omit<Popover.OverlayProps, "asChild" | "child" | "children">;
		withChild?: boolean;
	};
</script>

<script lang="ts">
	let { open = false, overlayProps, withChild = false, ...restProps }: PopoverOverlayTestProps = $props();
</script>

<main data-testid="main">
	<Popover.Root bind:open {...restProps}>
		<Popover.Trigger data-testid="trigger">trigger</Popover.Trigger>
		<Popover.Portal>
			{#if withChild}
				<Popover.Overlay {...overlayProps} data-testid="overlay">
					{#snippet child(props)}
						<div {...props.props} data-testid="overlay-child" data-open={props.open}>
							overlay
						</div>
					{/snippet}
				</Popover.Overlay>
			{:else}
				<Popover.Overlay {...overlayProps} data-testid="overlay">
					overlay content
				</Popover.Overlay>
			{/if}
			<Popover.Content data-testid="content">
				content
				<Popover.Close data-testid="close">close</Popover.Close>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>

	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<div data-testid="outside">outside</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>

