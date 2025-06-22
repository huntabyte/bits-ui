<script lang="ts">
	import type { ScrollAreaThumbProps } from "../types.js";
	import { ScrollAreaScrollbarVisibleContext } from "../scroll-area.svelte.js";
	import ScrollAreaThumbImpl from "./scroll-area-thumb-impl.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		forceMount = false,
		...restProps
	}: ScrollAreaThumbProps = $props();

	const scrollbarState = ScrollAreaScrollbarVisibleContext.get();
</script>

<PresenceLayer open={forceMount || scrollbarState.hasThumb} ref={scrollbarState.scrollbar.opts.ref}>
	{#snippet presence({ present })}
		<ScrollAreaThumbImpl {...restProps} {id} bind:ref {present} />
	{/snippet}
</PresenceLayer>
