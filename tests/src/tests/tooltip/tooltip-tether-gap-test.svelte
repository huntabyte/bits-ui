<script lang="ts">
	import { Tooltip } from "bits-ui";

	type Payload = {
		label: string;
	};

	const tether = Tooltip.createTether<Payload>();
	let open = $state(false);
</script>

<main data-testid="main" style="position: relative; width: 360px; height: 240px; padding: 24px;">
	<Tooltip.Provider delayDuration={0}>
		<div data-testid="automation-card" style="display: flex; align-items: center; gap: 16px;">
			<Tooltip.Trigger id="trigger-left" data-testid="trigger-left" {tether} payload={{ label: "Left" }}>
				Left
			</Tooltip.Trigger>
			<Tooltip.Trigger id="trigger-right" data-testid="trigger-right" {tether} payload={{ label: "Right" }}>
				Right
			</Tooltip.Trigger>
		</div>

		<Tooltip.Root {tether} bind:open>
			{#snippet children({ payload })}
				<Tooltip.Portal>
					<Tooltip.Content data-testid="content" side="top" sideOffset={10}>
						<span data-testid="payload">{payload?.label ?? "null"}</span>
					</Tooltip.Content>
				</Tooltip.Portal>
			{/snippet}
		</Tooltip.Root>
	</Tooltip.Provider>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
	<div data-testid="outside" style="margin-top: 120px;">outside</div>
</main>
