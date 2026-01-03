<script lang="ts" module>
	import { Popover } from "bits-ui";
	export type PopoverForceMountTestProps = Popover.RootProps & {
		triggerProps?: Omit<Popover.TriggerProps, "asChild" | "child" | "children">;
		contentProps?: Omit<Popover.ContentProps, "asChild" | "child" | "children">;
		portalProps?: Popover.PortalProps;
		withOpenCheck?: boolean;
	};
</script>

<script lang="ts">
	let {
		open = $bindable(false),
		triggerProps,
		contentProps,
		portalProps,
		withOpenCheck = false,
		...restProps
	}: PopoverForceMountTestProps = $props();
</script>

{#snippet Content({
	props,
	wrapperProps,
}: {
	props: Record<string, unknown>;
	wrapperProps: Record<string, unknown>;
})}
	<div {...wrapperProps}>
		<div {...props}>
			<div data-testid="content-text">content</div>
			<button data-testid="focusable-button">focusable button</button>
			<input data-testid="focusable-input" type="text" placeholder="input" />
			<Popover.Close data-testid="close">close</Popover.Close>
			<Popover.Arrow data-testid="arrow" />
		</div>
	</div>
{/snippet}

<main data-testid="main" style="display: flex; flex-direction: column; gap: 200px; padding: 20px;">
	<div>
		<Popover.Root bind:open {...restProps}>
			<Popover.Trigger data-testid="trigger" {...triggerProps}>trigger</Popover.Trigger>
			<Popover.Portal {...portalProps}>
				{#if withOpenCheck}
					<Popover.Content {...contentProps} data-testid="content" forceMount>
						{#snippet child(props)}
							{#if props.open}
								{@render Content(props)}
							{/if}
						{/snippet}
					</Popover.Content>
				{:else}
					<Popover.Content {...contentProps} data-testid="content" forceMount>
						{#snippet child(props)}
							{@render Content(props)}
						{/snippet}
					</Popover.Content>
				{/if}
			</Popover.Portal>
		</Popover.Root>

		<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	</div>

	<div data-testid="outside" style="padding: 20px; background: #eee;">outside</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>
