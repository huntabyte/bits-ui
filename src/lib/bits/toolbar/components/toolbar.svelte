<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let loop: $$Props["loop"] = true;
	export let orientation: $$Props["orientation"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root },
		updateOption
	} = setCtx({
		loop,
		orientation
	});

	const attrs = getAttrs("root");

	$: updateOption("loop", loop);
	$: updateOption("orientation", orientation);

	$: builder = $root;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
