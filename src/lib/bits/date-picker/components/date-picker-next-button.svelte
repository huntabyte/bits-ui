<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCalendarAttrs, getCtx } from "../ctx.js";
	import type { NextButtonProps } from "../types.js";

	type $$Props = NextButtonProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { nextButton }
	} = getCtx();

	$: builder = $nextButton;
	const attrs = getCalendarAttrs("next-button");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<button use:melt={builder} type="button" {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</button>
{/if}
