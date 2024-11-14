<script lang="ts" module>
	import { Tooltip, type WithoutChildrenOrChild } from "bits-ui";

	export type TooltipForceMountTestProps = WithoutChildrenOrChild<Tooltip.RootProps> & {
		contentProps?: WithoutChildrenOrChild<Tooltip.ContentProps>;
		portalProps?: WithoutChildrenOrChild<Tooltip.PortalProps>;
		withOpenCheck?: boolean;
	};
</script>

<script lang="ts">
	let {
		open = false,
		portalProps,
		contentProps,
		withOpenCheck,
		...restProps
	}: TooltipForceMountTestProps = $props();
</script>

<main data-testid="main">
	<Tooltip.Provider delayDuration={0}>
		<Tooltip.Root bind:open {...restProps}>
			<Tooltip.Trigger data-testid="trigger">@sveltejs</Tooltip.Trigger>
			<Tooltip.Portal {...portalProps}>
				{#if withOpenCheck}
					<Tooltip.Content
						{...contentProps}
						data-testid="content"
						class="w-80"
						forceMount
					>
						{#snippet child({ props, open })}
							{#if open}
								<div {...props}>Content</div>
							{/if}
						{/snippet}
					</Tooltip.Content>
				{:else}
					<Tooltip.Content
						{...contentProps}
						data-testid="content"
						class="w-80"
						forceMount
					>
						{#snippet child({ props, open: _open })}
							<div {...props}>Content</div>
						{/snippet}
					</Tooltip.Content>
				{/if}
			</Tooltip.Portal>
		</Tooltip.Root>
	</Tooltip.Provider>
	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<div class="h-96"></div>
	<div data-testid="outside" class="">outside</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>
