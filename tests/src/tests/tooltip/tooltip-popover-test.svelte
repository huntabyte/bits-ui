<script lang="ts">
	import { Popover, Tooltip } from "bits-ui";
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={0}>
		<Popover.Root>
			<Tooltip.Trigger data-testid="trigger">
				{#snippet child({ props })}
					<Popover.Trigger {...props}>Resize</Popover.Trigger>
				{/snippet}
			</Tooltip.Trigger>
			<Popover.Portal>
				<Popover.Content data-testid="popover-content"></Popover.Content>
			</Popover.Portal>
		</Popover.Root>
		<Tooltip.Portal>
			<Tooltip.Content data-testid="tooltip-content">Hello World!</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
