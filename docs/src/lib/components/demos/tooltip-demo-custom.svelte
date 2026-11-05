<script lang="ts">
	import { Tooltip, type WithoutChildren, type WithoutChildrenOrChild } from "bits-ui";
	import MagicWand from "phosphor-svelte/lib/MagicWand";

	let {
		delayDuration = 200,
		contentProps = { sideOffset: 8 },
		...restProps
	}: WithoutChildren<Tooltip.RootProps> & {
		contentProps?: WithoutChildrenOrChild<Tooltip.ContentProps>;
	} = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root {...restProps} {delayDuration}>
		<Tooltip.Trigger
			class="inline-flex size-10 items-center justify-center rounded-full
		border border-border-input bg-background-alt shadow-btn ring-dark ring-offset-background hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
		>
			<MagicWand class="size-5" />
		</Tooltip.Trigger>
		<Tooltip.Content
			{...contentProps}
			class="z-50 origin-(--bits-tooltip-content-transform-origin) animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
		>
			<div
				class="flex items-center justify-center rounded-input border border-dark-10 bg-background p-3 text-sm font-medium shadow-popover outline-hidden"
			>
				Make some magic!
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
