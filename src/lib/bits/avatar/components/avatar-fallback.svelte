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
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<span use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</span>
{/if}
