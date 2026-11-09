<script lang="ts">
	import type { PopperLayerImplProps } from "./types.js";
	import PopperLayerInner from "./popper-layer-inner.svelte";

	// Only `shouldRender` is read while closed: destructuring (or defaulting) any other prop
	// here would eagerly evaluate the caller's spread props (and their `mergeProps`) for
	// every closed instance. `PopperLayerInner` applies the same defaults.
	let { open, shouldRender, ...restProps }: PopperLayerImplProps = $props();
</script>

{#if shouldRender}
	<PopperLayerInner enabled={open} forceMount={false} {...restProps} />
{/if}
