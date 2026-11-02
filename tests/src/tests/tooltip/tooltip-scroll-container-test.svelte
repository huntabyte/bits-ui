<script lang="ts">
	import { Tooltip } from "bits-ui";
</script>

<Tooltip.Provider delayDuration={0}>
	<div data-testid="scroller" style="height: 100px; overflow-y: auto;">
		<button data-testid="before">before</button>
		<div style="height: 1000px;"></div>
		<Tooltip.Root>
			<Tooltip.Trigger data-testid="trigger">trigger</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content data-testid="content">Content</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	</div>
</Tooltip.Provider>
