<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useNavigationMenuContent } from "../navigation-menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { IsMounted } from "runed";
	import DismissableLayer from "$lib/bits/utilities/dismissable-layer/dismissable-layer.svelte";

	let {
		asChild,
		children: contentChildren,
		child,
		ref = $bindable(null),
		id = useId(),
		forceMount = false,
		...restProps
	}: ContentProps = $props();

	const contentState = useNavigationMenuContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => {
				ref = v;
			}
		),
		forceMount: box.with(() => forceMount),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
	const portalDisabled = $derived(!Boolean(contentState.menu.viewportNode));
	const mounted = new IsMounted();
</script>

<Portal to={contentState.menu.viewportNode} disabled={portalDisabled}>
	<PresenceLayer {id} present={contentState.isPresent}>
		{#snippet presence({ present })}
			<DismissableLayer
				enabled={present.value}
				{id}
				onInteractOutside={contentState.onInteractOutside}
				onFocusOutside={contentState.onFocusOutside}
			>
				{#snippet children({ props: dismissableProps })}
					{#if asChild}
						{@render child?.({ props: mergeProps(mergedProps, dismissableProps) })}
					{:else}
						<div bind:this={ref} {...mergeProps(mergedProps, dismissableProps)}>
							{@render contentChildren?.()}
						</div>
					{/if}
				{/snippet}
			</DismissableLayer>
		{/snippet}
	</PresenceLayer>
</Portal>
