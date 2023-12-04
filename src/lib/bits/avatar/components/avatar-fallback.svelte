<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { FallbackProps } from "../types.js";

	type $$Props = FallbackProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { fallback }
	} = getCtx();
	const attrs = getAttrs("fallback");

	$: builder = $fallback;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<span use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</span>
{/if}
