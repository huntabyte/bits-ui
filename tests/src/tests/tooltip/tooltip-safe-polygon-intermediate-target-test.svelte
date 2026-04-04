<script lang="ts">
	import { Tooltip } from "bits-ui";
</script>

<main data-testid="main" style="position: relative; width: 360px; height: 320px; padding: 24px;">
	<Tooltip.Provider delayDuration={0}>
		<Tooltip.Root>
			<Tooltip.Trigger
				data-testid="trigger"
				style="position: absolute; left: 120px; top: 24px;"
			>
				Trigger
			</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content data-testid="content" side="bottom" sideOffset={72}>
					Content
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	</Tooltip.Provider>

	<button
		data-testid="rail"
		style="position: absolute; left: 110px; top: 74px; width: 120px; height: 36px;"
	>
		Rail
	</button>
</main>
