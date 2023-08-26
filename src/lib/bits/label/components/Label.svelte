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
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
{#if asChild}
	<slot builder={$root} />
{:else}
	{@const builder = $root}
	<label use:melt={builder} {...$$restProps} on:m-mousedown={dispatch}>
		<slot {builder} />
	</label>
{/if}
