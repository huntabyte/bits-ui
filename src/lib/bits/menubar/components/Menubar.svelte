<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";
	import { writable } from "svelte/store";

	type $$Props = Props;

	export let loop = true;
	export let closeOnEscape = true;
	export let asChild = false;

	const {
		elements: { menubar },
		updateOption
	} = ctx.set({ loop, closeOnEscape });

	$: updateOption("loop", loop);
	$: updateOption("closeOnEscape", closeOnEscape);
</script>

{#if asChild}
	<slot builder={$menubar} />
{:else}
	{@const builder = $menubar}
	<div use:melt={builder} style="z-index: 50" {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
