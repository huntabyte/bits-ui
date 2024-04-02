<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { LinkEvents, LinkProps } from "../index.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = LinkProps;
	type $$Events = LinkEvents;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { link },
		getAttrs,
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("link");

	$: builder = $link;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svelte:element
		this={"a"}
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:click
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</svelte:element>
{/if}
