<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useNavigationMenuContent } from "../navigation-menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import DismissableLayer from "$lib/bits/utilities/dismissable-layer/dismissable-layer.svelte";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

	let {
		asChild,
		children: contentChildren,
		child,
		ref = $bindable(null),
		id = useId(),
		forceMount = false,
		...restProps
	}: ContentProps = $props();

	let isMounted = $state(false);

	const contentState = useNavigationMenuContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => {
				ref = v;
			}
		),
		forceMount: box.with(() => forceMount),
		isMounted: box.with(() => isMounted),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
	const portalDisabled = $derived(!Boolean(contentState.menu.viewportNode));
</script>

<Portal to={contentState.menu.viewportNode ?? undefined} disabled={portalDisabled}>
	<PresenceLayer {id} present={contentState.isPresent}>
		{#snippet presence({ present })}
			<EscapeLayer
				enabled={contentState.isPresent}
				onEscapeKeydown={(e) => contentState.onEscapeKeydown(e)}
			>
				<DismissableLayer
					enabled={contentState.isPresent}
					{id}
					onInteractOutside={contentState.onInteractOutside}
					onFocusOutside={contentState.onFocusOutside}
				>
					{#snippet children({ props: dismissableProps })}
						{#if asChild}
							<Mounted bind:isMounted />
							{@render child?.({ props: mergeProps(dismissableProps, mergedProps) })}
						{:else}
							<Mounted bind:isMounted />
							<div {...mergeProps(dismissableProps, mergedProps)}>
								{@render contentChildren?.()}
							</div>
						{/if}
					{/snippet}
				</DismissableLayer>
			</EscapeLayer>
		{/snippet}
	</PresenceLayer>
</Portal>
