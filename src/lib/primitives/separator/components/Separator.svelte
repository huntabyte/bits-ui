<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let orientation: $$Props["orientation"] = "horizontal";
	export let decorative: $$Props["decorative"] = true;
	export let asChild = false;

	const {
		elements: { root },
		updateOption
	} = ctx.get({ orientation, decorative });

	$: updateOption("orientation", orientation);
	$: updateOption("decorative", decorative);
</script>

{#if asChild}
	<slot builder={$root} />
{:else}
	<div use:melt={$root} {...$$restProps} />
{/if}
