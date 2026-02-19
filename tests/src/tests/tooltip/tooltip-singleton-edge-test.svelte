<script lang="ts">
	import { Tooltip } from "bits-ui";

	const tether = Tooltip.createTether<{ label: string }>();
	let open = $state(false);
	let triggerId = $state<string | null>(null);
	let showTriggerOne = $state(true);
	let disableTriggerTwo = $state(false);
	let useCustomAnchor = $state(false);
	let customAnchor = $state<HTMLElement | null>(null);
</script>

<main data-testid="main">
	<Tooltip.Provider delayDuration={0}>
		<Tooltip.Root {tether} bind:open bind:triggerId>
			{#snippet children({ payload })}
				<div data-testid="trigger-group">
					{#if showTriggerOne}
						<Tooltip.Trigger
							id="trigger-1"
							data-testid="trigger-1"
							{tether}
							payload={{ label: "First" }}
						>
							First
						</Tooltip.Trigger>
					{/if}

					<Tooltip.Trigger
						id="trigger-2"
						data-testid="trigger-2"
						{tether}
						disabled={disableTriggerTwo}
						payload={{ label: "Second" }}
					>
						Second
					</Tooltip.Trigger>

					<Tooltip.Trigger
						id="trigger-disabled"
						data-testid="trigger-disabled"
						{tether}
						disabled
						payload={{ label: "Disabled" }}
					>
						Disabled
					</Tooltip.Trigger>
				</div>

				<Tooltip.Portal>
					<Tooltip.Content
						data-testid="content"
						customAnchor={useCustomAnchor ? customAnchor : undefined}
					>
						<span data-testid="payload">{payload?.label ?? "null"}</span>
					</Tooltip.Content>
				</Tooltip.Portal>
			{/snippet}
		</Tooltip.Root>
	</Tooltip.Provider>

	<button data-testid="toggle-trigger-one" onclick={() => (showTriggerOne = !showTriggerOne)}>
		Toggle trigger 1
	</button>
	<button
		data-testid="toggle-trigger-two-disabled"
		onclick={() => (disableTriggerTwo = !disableTriggerTwo)}
	>
		Toggle trigger 2 disabled
	</button>
	<button data-testid="toggle-custom-anchor" onclick={() => (useCustomAnchor = !useCustomAnchor)}>
		Toggle custom anchor
	</button>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
	<div data-testid="trigger-binding">{triggerId ?? "null"}</div>
	<div
		bind:this={customAnchor}
		data-testid="custom-anchor"
		style="margin-top: 20px; margin-left: 220px; width: 20px; height: 20px;"
	>
		anchor
	</div>
	<div data-testid="outside">outside</div>
</main>
