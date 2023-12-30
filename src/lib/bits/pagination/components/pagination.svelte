<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getAttrs, setCtx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let count: $$Props["count"];
	export let page: $$Props["page"] = undefined;
	export let onPageChange: $$Props["onPageChange"] = undefined;
	export let perPage: $$Props["perPage"] = undefined;
	export let siblingCount: $$Props["siblingCount"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root },
		states: { pages, range }
	} = setCtx({
		count,
		perPage,
		siblingCount,
		defaultPage: page,
		onPageChange: ({ next }) => {
			if (page !== next) {
				onPageChange?.(next);
				page = next;
			}

			return next;
		}
	});

	const attrs = getAttrs("root");

	$: builder = $root;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} pages={$pages} range={$range} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} pages={$pages} range={$range} />
	</div>
{/if}
