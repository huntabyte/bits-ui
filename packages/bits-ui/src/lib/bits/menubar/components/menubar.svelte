<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { derived } from "svelte/store";
	import { setCtx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let loop: $$Props["loop"] = true;
	export let closeOnEscape: $$Props["closeOnEscape"] = true;
	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let preventScroll: $$Props["preventScroll"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { menubar },
		updateOption,
		ids,
		getMenubarAttrs,
	} = setCtx({ loop, closeOnEscape, preventScroll });

	const idValues = derived([ids.menubar], ([$menubarId]) => ({
		menubar: $menubarId,
	}));
	const attrs = getMenubarAttrs("root");

	$: if (id) {
		ids.menubar.set(id);
	}

	$: updateOption("loop", loop);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: updateOption("preventScroll", preventScroll);
	$: builder = $menubar;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} ids={$idValues} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} ids={$idValues} />
	</div>
{/if}
