<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let loop: $$Props["loop"] = true;
	export let closeOnEscape: $$Props["closeOnEscape"] = true;

	const {
		elements: { menubar },
		updateOption
	} = ctx.set($$restProps);

	$: updateOption("loop", loop);
	$: updateOption("closeOnEscape", closeOnEscape);
</script>

<div use:melt={$menubar} {...$$restProps}>
	<slot />
</div>
