<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";
	import { derived } from "svelte/store";

	type $$Props = Props;

	export let loop: $$Props["loop"] = true;
	export let closeOnEscape: $$Props["closeOnEscape"] = true;
	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { menubar },
		updateOption,
		ids
	} = setCtx({ loop, closeOnEscape });

	const idValues = derived([ids.menubar], ([$menubarId]) => ({
		menubar: $menubarId
	}));

	$: if (id) {
		ids.menubar.set(id);
	}

	$: updateOption("loop", loop);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: builder = $menubar;
	const attrs = getAttrs("root");
</script>

{#if asChild}
	<slot {builder} {attrs} ids={$idValues} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} ids={$idValues} />
	</div>
{/if}
