<script lang="ts">
	import { Tooltip } from "bits-ui";

	const tether = Tooltip.createTether<{ label: string }>();
	let open = $state(false);
	let triggerId = $state<string | null>(null);
</script>

<main data-testid="main">
	<Tooltip.Provider delayDuration={0}>
		<Tooltip.Root {tether} bind:open bind:triggerId>
			{#snippet children({ payload })}
				<Tooltip.Trigger
					id="trigger-1"
					data-testid="trigger-1"
					{tether}
					payload={{ label: "One" }}
				>
					One
				</Tooltip.Trigger>
				<Tooltip.Trigger
					id="trigger-2"
					data-testid="trigger-2"
					{tether}
					payload={{ label: "Two" }}
				>
					Two
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content data-testid="content">
						<span data-testid="payload">{payload?.label ?? "null"}</span>
					</Tooltip.Content>
				</Tooltip.Portal>
			{/snippet}
		</Tooltip.Root>
	</Tooltip.Provider>

	<button
		data-testid="open-trigger-1"
		onclick={() => {
			triggerId = "trigger-1";
			open = true;
		}}
	>
		Open Trigger 1
	</button>
	<button
		data-testid="open-trigger-2"
		onclick={() => {
			triggerId = "trigger-2";
			open = true;
		}}
	>
		Open Trigger 2
	</button>
	<button
		data-testid="set-null-trigger"
		onclick={() => {
			triggerId = null;
		}}
	>
		Set null trigger
	</button>
	<button
		data-testid="close"
		onclick={() => {
			open = false;
		}}
	>
		Close
	</button>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
	<div data-testid="trigger-binding">{triggerId ?? "null"}</div>
	<div data-testid="outside">outside</div>
</main>
