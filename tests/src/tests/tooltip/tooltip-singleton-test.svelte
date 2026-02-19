<script lang="ts" module>
	export type TooltipSingletonTestProps = {
		delayDuration?: number;
		skipDelayDuration?: number;
	};
</script>

<script lang="ts">
	import { Tooltip } from "bits-ui";

	let { delayDuration = 0, skipDelayDuration = 300 }: TooltipSingletonTestProps = $props();

	const tether = Tooltip.createTether<{ label: string }>();
	let open = $state(false);
	let triggerId = $state<string | null>(null);
</script>

<main data-testid="main">
	<Tooltip.Provider {delayDuration} {skipDelayDuration}>
		<Tooltip.Root {tether} bind:open bind:triggerId>
			{#snippet children({ payload })}
				<div data-testid="trigger-group">
					<Tooltip.Trigger
						id="trigger-1"
						data-testid="trigger-1"
						{tether}
						payload={{ label: "Bold" }}
					>
						Bold
					</Tooltip.Trigger>
					<Tooltip.Trigger
						id="trigger-2"
						data-testid="trigger-2"
						{tether}
						payload={{ label: "Italic" }}
					>
						Italic
					</Tooltip.Trigger>
				</div>
				<Tooltip.Portal>
					<Tooltip.Content data-testid="content">
						<span data-testid="payload">{payload?.label ?? "null"}</span>
					</Tooltip.Content>
				</Tooltip.Portal>
			{/snippet}
		</Tooltip.Root>
	</Tooltip.Provider>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
	<div data-testid="trigger-binding">{triggerId ?? "null"}</div>
	<div data-testid="outside">outside</div>
</main>
