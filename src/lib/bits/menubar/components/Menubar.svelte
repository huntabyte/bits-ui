<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";
	import { derived } from "svelte/store";

	type $$Props = Props;

	export let loop = true;
	export let closeOnEscape = true;
	export let asChild = false;

	const {
		elements: { menubar },
		updateOption,
		ids
	} = setCtx({ loop, closeOnEscape });

	const idValues = derived([ids.menubar], ([$menubarId]) => ({
		menubar: $menubarId
	}));

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
