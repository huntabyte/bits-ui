<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { NavigationMenuContentState } from "../navigation-menu.svelte.js";
	import NavigationMenuContentImpl from "./navigation-menu-content-impl.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import type { NavigationMenuContentProps } from "$lib/types.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import Mounted from "$lib/bits/utilities/mounted.svelte";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		children,
		child,
		forceMount = false,
		...restProps
	}: NavigationMenuContentProps = $props();

	const contentState = NavigationMenuContentState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

<Portal
	to={contentState.context.viewportRef.current || undefined}
	disabled={!contentState.context.viewportRef.current}
>
	<PresenceLayer
		open={forceMount || contentState.open || contentState.isLastActiveValue}
		ref={contentState.opts.ref}
	>
		{#snippet presence()}
			<NavigationMenuContentImpl {...mergedProps} {children} {child} />
			<Mounted bind:mounted={contentState.mounted} />
		{/snippet}
	</PresenceLayer>
</Portal>
