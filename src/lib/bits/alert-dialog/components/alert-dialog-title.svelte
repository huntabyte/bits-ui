<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TitleProps } from "../types.js";

	type $$Props = TitleProps;

	export let level: $$Props["level"] = "h2";
	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { title },
		ids
	} = getCtx();

	const attrs = getAttrs("title");

	$: if (id) {
		ids.title.set(id);
	}

	$: builder = $title;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<svelte:element
		this={level}
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
	>
		<slot {builder} />
	</svelte:element>
{/if}
