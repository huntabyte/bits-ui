<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCalendarAttrs, getCtx } from "../ctx.js";
	import type { NextButtonProps } from "../types.js";

	type $$Props = NextButtonProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { nextButton }
	} = getCtx();

	const attrs = getCalendarAttrs("next-button");

	$: builder = $nextButton;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button bind:this={el} use:melt={builder} type="button" {...$$restProps}>
		<slot {builder} />
	</button>
{/if}
