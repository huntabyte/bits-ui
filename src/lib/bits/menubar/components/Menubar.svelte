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
	const attrs = getAttrs("root");

	$: if (id) {
		ids.menubar.set(id);
	}

	$: updateOption("loop", loop);
	$: updateOption("closeOnEscape", closeOnEscape);
	$: builder = $menubar;
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} ids={$idValues} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} ids={$idValues} />
	</div>
{/if}
