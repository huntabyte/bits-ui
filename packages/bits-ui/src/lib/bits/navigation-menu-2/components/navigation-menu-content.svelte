<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useNavigationMenuContent } from "../navigation-menu.svelte.js";
	import NavigationMenuContentImpl from "./navigation-menu-content-impl.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import type { NavigationMenuContentProps } from "$lib/types.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		ref = $bindable(null),
		id = useId(),
		children,
		child,
		forceMount = false,
		...restProps
	}: NavigationMenuContentProps = $props();

	const contentState = useNavigationMenuContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if contentState.context.viewportRef.current}
	<Portal to={contentState.context.viewportRef.current}>
		<PresenceLayer
			{id}
			present={forceMount || contentState.open || contentState.isLastActiveValue}
		>
			{#snippet presence()}
				<NavigationMenuContentImpl {...mergedProps} {children} {child} />
			{/snippet}
		</PresenceLayer>
	</Portal>
{/if}

<!-- {#if !contentState.context.viewportRef.current}
	<PresenceLayer {id} present={forceMount || contentState.open}>
		{#snippet presence()}
			<NavigationMenuContentImpl {...mergedProps} {children} {child} />
		{/snippet}
	</PresenceLayer>
{:else}
	<NavigationMenuViewportContentMounter {children} {child} {...mergedProps} />
{/if} -->
