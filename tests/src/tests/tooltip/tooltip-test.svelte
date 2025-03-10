<script lang="ts" module>
	import { Tooltip, type WithoutChildrenOrChild } from "bits-ui";

	export type TooltipTestProps = WithoutChildrenOrChild<Tooltip.RootProps> & {
		contentProps?: WithoutChildrenOrChild<Tooltip.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Tooltip.PortalProps>;
		withCustomAnchor?: boolean;
	};
</script>

<script lang="ts">
	let {
		open = false,
		portalProps,
		contentProps,
		withCustomAnchor = false,
		...restProps
	}: TooltipTestProps = $props();

	let customAnchor = $state<HTMLElement | null>(null);
</script>

<main data-testid="main">
	<Tooltip.Provider delayDuration={0}>
		<Tooltip.Root bind:open {...restProps}>
			<Tooltip.Trigger data-testid="trigger">@sveltejs</Tooltip.Trigger>
			<Tooltip.Portal {...portalProps}>
				<Tooltip.Content
					{...contentProps}
					customAnchor={withCustomAnchor ? customAnchor : undefined}
					data-testid="content"
				>
					Content
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	</Tooltip.Provider>
	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<div class="h-96"></div>
	<div data-testid="outside" class="">outside</div>
	<div data-testid="custom-anchor" bind:this={customAnchor}>Content</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>
