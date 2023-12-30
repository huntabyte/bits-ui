<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCalendarAttrs, getCtx } from "../ctx.js";
	import type { PrevButtonProps } from "../types.js";

	type $$Props = PrevButtonProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { prevButton }
	} = getCtx();

	const attrs = getCalendarAttrs("prev-button");

	$: builder = $prevButton;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button bind:this={el} use:melt={builder} type="button" {...$$restProps}>
		<slot {builder} />
	</button>
{/if}
