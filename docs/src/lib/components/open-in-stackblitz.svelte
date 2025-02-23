<script lang="ts">
	import { openInStackBlitz } from "$lib/utils/open-in-stackblitz.js";
	import Stackblitz from "$icons/stackblitz.svelte";
	import { Tooltip } from "bits-ui";

	let { demoName, componentName = demoName }: { demoName: string; componentName?: string } =
		$props();
</script>

<div class="absolute bottom-2 right-2">
	<Tooltip.Provider>
		<Tooltip.Root delayDuration={0}>
			<Tooltip.Trigger
				onclick={() => openInStackBlitz(demoName, componentName)}
				class="ring-dark ring-offset-background hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden group inline-flex size-9 cursor-pointer items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				<Stackblitz class="text-foreground/30 group-hover:text-foreground size-[18px]" />
			</Tooltip.Trigger>
			<Tooltip.Content sideOffset={4}>
				<div
					class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 flex select-none items-center justify-center border p-3 text-xs"
				>
					Open in StackBlitz
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
</div>
