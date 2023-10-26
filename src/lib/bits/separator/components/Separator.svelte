<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let orientation: $$Props["orientation"] = "horizontal";
	export let decorative = true;
	export let asChild = false;

	const {
		elements: { root },
		updateOption
	} = ctx.get({ orientation, decorative });

	$: updateOption("orientation", orientation);
	$: updateOption("decorative", decorative);

	$: builder = $root;
	const attrs = ctx.getAttrs("root");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs} />
{/if}
