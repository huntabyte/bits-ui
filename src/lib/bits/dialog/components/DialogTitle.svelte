<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TitleProps } from "../types.js";

	type $$Props = TitleProps;
	export let level: $$Props["level"] = "h2";
	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	const {
		elements: { title },
		ids
	} = getCtx();

	$: if (id) {
		ids.title.set(id);
	}
	$: builder = $title;
	const attrs = getAttrs("title");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<svelte:element this={level} use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</svelte:element>
{/if}
