<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let loop = true;
	export let closeOnEscape = true;
	export let asChild = false;

	const {
		elements: { menubar },
		updateOption,
		ids
	} = setCtx({ loop, closeOnEscape });

	$: updateOption("loop", loop);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: builder = $menubar;
	const attrs = getAttrs("root");
</script>

{#if asChild}
	<slot {builder} {attrs} {ids} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} {ids} />
	</div>
{/if}
