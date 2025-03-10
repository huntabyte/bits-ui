<script lang="ts">
	import { Tooltip } from "bits-ui";
	import MagicWand from "phosphor-svelte/lib/MagicWand";

	let customAnchor = $state<HTMLElement | null>(null);
</script>

<div class="flex items-center gap-6">
	<div class="rounded-md border p-3" bind:this={customAnchor}>Custom Anchor</div>
	<Tooltip.Provider>
		<Tooltip.Root delayDuration={200}>
			<Tooltip.Trigger
				class="border-border-input bg-background-alt shadow-btn ring-dark ring-offset-background
			hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex size-10 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				<MagicWand class="size-5" />
			</Tooltip.Trigger>
			<Tooltip.Content sideOffset={8} {customAnchor}>
				<div
					class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 flex items-center justify-center border p-3 text-sm font-medium"
				>
					Make some magic!
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
</div>
