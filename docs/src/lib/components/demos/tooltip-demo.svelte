<script lang="ts">
	import { Tooltip } from "bits-ui";
	import MagicWand from "phosphor-svelte/lib/MagicWand";
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger
			class="border-border-input bg-background-alt shadow-btn ring-dark ring-offset-background
		hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background inline-flex size-10 items-center justify-center rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
		>
			<MagicWand class="size-5" />
		</Tooltip.Trigger>
		<Tooltip.Content sideOffset={8}>
			<div
				class="rounded-input border-dark-10 bg-background shadow-popover z-0 flex items-center justify-center border p-3 text-sm font-medium outline-none"
			>
				Make some magic!
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
