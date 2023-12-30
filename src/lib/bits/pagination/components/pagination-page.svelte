<script lang="ts">
	import { createDispatcher } from "$lib/internal/events.js";
	import { getAttrs, getCtx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";
	import type { PageEvents, PageProps } from "../types.js";

	type $$Props = PageProps;
	type $$Events = PageEvents;

	export let asChild: $$Props["asChild"] = undefined;
	export let page: $$Props["page"];
	export let el: $$Props["el"] = undefined;

	const {
		elements: { pageTrigger }
	} = getCtx();

	const attrs = getAttrs("page");

	$: builder = $pageTrigger(page);
	$: Object.assign(builder, attrs);

	const dispatch = createDispatcher();
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		type="button"
		use:melt={builder}
		on:m-click={dispatch}
		{...$$restProps}
	>
		<slot {builder}>
			{page.value}
		</slot>
	</button>
{/if}
