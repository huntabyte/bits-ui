<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { FallbackProps } from "../types.js";

	type $$Props = FallbackProps;
	export let asChild = false;
	const fallback = getCtx().elements.fallback;
	$: builder = $fallback;
	const attrs = getAttrs("fallback");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<span use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</span>
{/if}
