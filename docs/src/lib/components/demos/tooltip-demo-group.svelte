<script lang="ts">
	import { Tooltip } from "bits-ui";
</script>

{#snippet tooltip({ label, content }: { label: string; content: string })}
	<Tooltip.Root delayDuration={600}>
		<Tooltip.Trigger
			class="border-border-input bg-background-alt shadow-btn ring-dark ring-offset-background
	hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex size-10 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:ring-offset-2"
		>
			{label}
		</Tooltip.Trigger>
		<Tooltip.Content sideOffset={8}>
			<div
				class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 flex items-center justify-center border p-3 text-sm font-medium"
			>
				{content}
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
{/snippet}

<Tooltip.Provider skipDelayDuration={300}>
	<div class="flex items-center gap-1">
		{@render tooltip({ label: "A", content: "Make some magic - A!" })}
		{@render tooltip({ label: "B", content: "Make some magic - B!" })}
		{@render tooltip({ label: "C", content: "Make some magic - C!" })}
		{@render tooltip({ label: "D", content: "Make some magic - D!" })}
	</div>
</Tooltip.Provider>
