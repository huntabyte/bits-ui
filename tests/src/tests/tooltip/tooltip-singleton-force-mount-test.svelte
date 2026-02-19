<script lang="ts" module>
	import type { WithoutChildrenOrChild } from "bits-ui";

	export type TooltipSingletonForceMountTestProps = WithoutChildrenOrChild<
		Tooltip.RootProps<{ label: string }>
	> & {
		withOpenCheck?: boolean;
	};
</script>

<script lang="ts">
	import { Tooltip } from "bits-ui";

	let { withOpenCheck = false, ...rootProps }: TooltipSingletonForceMountTestProps = $props();

	const tether = Tooltip.createTether<{ label: string }>();
	let open = $state(false);
	let triggerId = $state<string | null>(null);
</script>

<main data-testid="main">
	<Tooltip.Provider delayDuration={0}>
		<Tooltip.Root {tether} bind:open bind:triggerId {...rootProps}>
			{#snippet children({ payload })}
				<Tooltip.Trigger
					id="trigger-1"
					data-testid="trigger-1"
					{tether}
					payload={{ label: "Alpha" }}
				>
					Alpha
				</Tooltip.Trigger>
				<Tooltip.Trigger
					id="trigger-2"
					data-testid="trigger-2"
					{tether}
					payload={{ label: "Beta" }}
				>
					Beta
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content data-testid="content" forceMount>
						{#snippet child({ wrapperProps, props, open: contentOpen })}
							{#if withOpenCheck}
								{#if contentOpen}
									<div {...wrapperProps}>
										<div {...props} data-testid="content-node">
											<span data-testid="payload"
												>{payload?.label ?? "null"}</span
											>
										</div>
									</div>
								{/if}
							{:else}
								<div {...wrapperProps}>
									<div {...props} data-testid="content-node">
										<span data-testid="payload">{payload?.label ?? "null"}</span
										>
									</div>
								</div>
							{/if}
						{/snippet}
					</Tooltip.Content>
				</Tooltip.Portal>
			{/snippet}
		</Tooltip.Root>
	</Tooltip.Provider>
	<div data-testid="open-binding">{open ? "true" : "false"}</div>
	<div data-testid="trigger-binding">{triggerId ?? "null"}</div>
	<div data-testid="outside">outside</div>
</main>
