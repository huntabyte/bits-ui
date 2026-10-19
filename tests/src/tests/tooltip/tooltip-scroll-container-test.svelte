<script lang="ts">
	import { Tooltip } from "bits-ui";

	let open = $state(false);
</script>

<main data-testid="main">
	<div data-testid="scroller" style="height: 100px; overflow-y: auto; margin-top: 200px;">
		<div style="height: 40px;"></div>
		<Tooltip.Provider delayDuration={0}>
			<Tooltip.Root bind:open>
				<Tooltip.Trigger data-testid="trigger">trigger</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content data-testid="content" hideWhenDetached>
						Content
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
		<div style="height: 400px;"></div>
	</div>
</main>
