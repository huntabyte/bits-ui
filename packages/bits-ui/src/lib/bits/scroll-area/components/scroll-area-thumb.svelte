<script lang="ts">
	import type { ThumbProps } from "../index.js";
	import { getScrollAreaScrollbarVisibleContext } from "../scroll-area.svelte.js";
	import ScrollAreaThumbImpl from "./scroll-area-thumb-impl.svelte";
	import { useId } from "$lib/internal/useId.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		...restProps
	}: ThumbProps = $props();

	const scrollbarState = getScrollAreaScrollbarVisibleContext();
</script>

<PresenceLayer present={forceMount || scrollbarState.hasThumb} {...restProps} {id}>
	{#snippet presence({ present })}
		<ScrollAreaThumbImpl {...restProps} {id} bind:ref present={present.current} />
	{/snippet}
</PresenceLayer>
