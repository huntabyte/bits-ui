<script lang="ts">
	import { melt, createLabel } from "@melt-ui/svelte";
	import { getAttrs } from "../ctx.js";
	import type { Events, Props } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = Props;
	type $$Events = Events;
	export let asChild = false;
	const root = createLabel().elements.root;

	const dispatch = createDispatcher();
	$: builder = $root;
	const attrs = getAttrs("root");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<label use:melt={builder} {...$$restProps} {...attrs} on:m-mousedown={dispatch}>
		<slot {builder} {attrs} />
	</label>
{/if}
