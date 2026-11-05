<script lang="ts">
	import { Tooltip } from "bits-ui";

	const tether = Tooltip.createTether<{ label: string }>();
	let shown = $state(true);
	let id = $state("trigger-a");
	let label = $state("A");
	let open = $state(false);
	let triggerId = $state<string | null>(null);
</script>

<Tooltip.Provider delayDuration={0}>
	<div style="padding: 120px 0 0 200px;">
		<Tooltip.Trigger {id} {tether} payload={{ label }}>
			{#snippet child({ props })}
				{#if shown}
					<button {...props} data-testid="trigger">Trigger</button>
				{/if}
			{/snippet}
		</Tooltip.Trigger>
	</div>
	<Tooltip.Root {tether} bind:open bind:triggerId>
		{#snippet children({ payload })}
			<span data-testid="payload">{payload?.label ?? "null"}</span>
			<Tooltip.Portal>
				<Tooltip.Content data-testid="content" side="bottom" sideOffset={8}>
					content
				</Tooltip.Content>
			</Tooltip.Portal>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
<button data-testid="toggle" onclick={() => (shown = !shown)}>toggle</button>
<button
	data-testid="rename"
	onclick={() => {
		id = "trigger-b";
		label = "B";
	}}
>
	rename
</button>
<button data-testid="open-a" onclick={() => tether.open("trigger-a")}>open a</button>
<button data-testid="open-b" onclick={() => tether.open("trigger-b")}>open b</button>
<button data-testid="close" onclick={() => tether.close()}>close</button>
<div data-testid="open-binding">{open}</div>
<div data-testid="trigger-binding">{triggerId ?? "null"}</div>
