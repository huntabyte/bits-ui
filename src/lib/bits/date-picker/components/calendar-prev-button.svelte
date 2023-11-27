<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getAttrs, getCtx } from "../ctx.js";
	import type { PrevButtonProps } from "../types.js";

	type $$Props = PrevButtonProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { prevButton }
	} = getCtx();

	$: builder = $prevButton;
	const attrs = getAttrs("prev-button");

	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<button use:melt={builder} type="button" {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</button>
{/if}
