<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useNavigationMenuContent } from "../navigation-menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import EscapeLayer from "$lib/bits/utilities/escape-layer/escape-layer.svelte";
	import DismissableLayer from "$lib/bits/utilities/dismissable-layer/dismissable-layer.svelte";
	import { IsMounted } from "runed";
	import { isBrowser } from "$lib/internal/is.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(),
		id = useId(),
		forceMount = false,
		...restProps
	}: ContentProps = $props();

	const contentState = useNavigationMenuContent({
		id: box.with(() => id),
	});
	const mergedProps = $derived(mergeProps(restProps, contentState.props));
	const viewportId = $derived(contentState.menu.viewportId.value);
	const viewportNode = $derived.by(() => {
		if (!isBrowser) return undefined;
		const node = document.getElementById(viewportId ?? "");
		if (!node) return undefined;
	});
	const portalDisabled = $derived(!Boolean(viewportNode));
	const mounted = new IsMounted();
</script>

{#if mounted.current}
	<Portal to={viewportNode} disabled={portalDisabled}>
		<PresenceLayer {id} present={forceMount || contentState.open}>
			{#snippet presence({ present })}
				{#if asChild}
					{@render child?.({ props: mergedProps })}
				{:else}
					<div bind:this={ref} {...mergedProps}>
						{@render children?.()}
					</div>
				{/if}
			{/snippet}
		</PresenceLayer>
	</Portal>
{/if}
