<script lang="ts">
	import { Tooltip } from "$lib";
	import { flyAndScale } from "@/utils";
</script>

<Tooltip.Root openDelay={200}>
	<Tooltip.Trigger
		class="inline-flex h-12 items-center
	justify-center whitespace-nowrap rounded-input bg-dark px-[21px]
	text-[15px] font-semibold text-background shadow-mini ring-dark ring-offset-background transition-all hover:bg-dark/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
	>
		Hover me
	</Tooltip.Trigger>
	<Tooltip.Content
		class="z-20 flex items-center justify-center rounded-input border border-muted bg-background p-3 text-sm font-medium shadow-mini outline-none"
		transition={flyAndScale}
		transitionConfig={{ y: 8, duration: 150 }}
		sideOffset={8}
	>
		It doesn't get much better than bits.
	</Tooltip.Content>
</Tooltip.Root>
