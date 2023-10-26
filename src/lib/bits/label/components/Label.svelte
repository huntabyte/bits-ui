<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Events, Props } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = Props;
	type $$Events = Events;
	export let asChild = false;
	const {
		elements: { root }
	} = ctx.get();
	const dispatch = createDispatcher();
	$: builder = $root;
	const attrs = ctx.getAttrs("root");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<label use:melt={builder} {...$$restProps} {...attrs} on:m-mousedown={dispatch}>
		<slot {builder} {attrs} />
	</label>
{/if}
