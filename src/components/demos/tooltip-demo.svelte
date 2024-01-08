<script lang="ts">
	import { Tooltip } from "$lib/index.js";
	import { flyAndScale } from "@/utils/index.js";
	import { MagicWand } from "phosphor-svelte";
</script>

<Tooltip.Root openDelay={200} open={true}>
	<Tooltip.Trigger
		class="inline-flex size-10 items-center justify-center rounded-full
	border border-border-input bg-background shadow-btn ring-dark ring-offset-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	>
		<MagicWand class="size-5" />
	</Tooltip.Trigger>
	<Tooltip.Content
		transition={flyAndScale}
		transitionConfig={{ y: 8, duration: 150 }}
		class="flex items-center justify-center rounded-input border border-dark-10 bg-background p-3 text-sm font-medium shadow-popover outline-none"
		sideOffset={8}
	>
		<Tooltip.Arrow class="border-l border-t border-dark-10" />
		<div>Make some magic!</div>
	</Tooltip.Content>
</Tooltip.Root>
