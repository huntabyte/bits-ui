<script lang="ts">
	import { Tooltip } from "bits-ui";

	const tether = Tooltip.createTether<{ label: string }>();
	let open = $state(false);
	let triggerId = $state<string | null>(null);
</script>

<main data-testid="main">
	<Tooltip.Provider delayDuration={0}>
		<div data-testid="detached-top">
			<Tooltip.Trigger
				id="trigger-top"
				data-testid="trigger-top"
				{tether}
				payload={{ label: "Top" }}
			>
				Top
			</Tooltip.Trigger>
		</div>

		<Tooltip.Root {tether} bind:open bind:triggerId>
			{#snippet children({ payload })}
				<Tooltip.Portal>
					<Tooltip.Content data-testid="content" sideOffset={10}>
						<span data-testid="payload">{payload?.label ?? "null"}</span>
					</Tooltip.Content>
				</Tooltip.Portal>
			{/snippet}
		</Tooltip.Root>

		<div data-testid="detached-bottom">
			<Tooltip.Trigger
				id="trigger-bottom"
				data-testid="trigger-bottom"
				{tether}
				payload={{ label: "Bottom" }}
			>
				Bottom
			</Tooltip.Trigger>
			<Tooltip.Trigger id="trigger-disabled" data-testid="trigger-disabled" {tether} disabled>
				Disabled
			</Tooltip.Trigger>
		</div>
	</Tooltip.Provider>
	<button data-testid="tether-open-top" onclick={() => tether.open("trigger-top")}>
		Open top
	</button>
	<button data-testid="tether-open-bottom" onclick={() => tether.open("trigger-bottom")}>
		Open bottom
	</button>
	<button data-testid="tether-close" onclick={() => tether.close()}> Close tether </button>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
	<div data-testid="trigger-binding">{triggerId ?? "null"}</div>
	<div data-testid="outside">outside</div>
</main>
