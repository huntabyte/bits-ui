<script lang="ts">
	import { openInStackBlitz } from "#lib/utils/open-in-stackblitz.js";
	import Stackblitz from "#icons/stackblitz.svelte";
	import { Tooltip } from "bits-ui";

	let { demoName, componentName = demoName }: { demoName: string; componentName?: string } =
		$props();
</script>

<div class="absolute right-2 bottom-2">
	<Tooltip.Provider>
		<Tooltip.Root delayDuration={0}>
			<Tooltip.Trigger
				onclick={() => openInStackBlitz(demoName, componentName)}
				class="group inline-flex size-9 cursor-pointer items-center justify-center rounded-lg ring-dark ring-offset-background hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
			>
				<Stackblitz class="size-[18px] text-foreground/30 group-hover:text-foreground" />
			</Tooltip.Trigger>
			<Tooltip.Content class="z-50" sideOffset={4}>
				<div
					class="z-0 flex items-center justify-center rounded-input border border-dark-10 bg-background p-3 text-xs shadow-popover outline-hidden select-none"
				>
					Open in StackBlitz
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
</div>
