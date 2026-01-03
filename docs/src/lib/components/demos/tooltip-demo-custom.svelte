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
			class="border-border-input bg-background-alt shadow-btn ring-dark ring-offset-background
		hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex size-10 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:ring-offset-2"
		>
			<MagicWand class="size-5" />
		</Tooltip.Trigger>
		<Tooltip.Content
			{...contentProps}
			class="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-tooltip-content-transform-origin)"
		>
			<div
				class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden flex items-center justify-center border p-3 text-sm font-medium"
			>
				Make some magic!
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
