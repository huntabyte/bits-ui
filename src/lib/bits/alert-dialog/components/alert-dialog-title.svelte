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

	const attrs = getAttrs("title");

	$: if (id) {
		ids.title.set(id);
	}

	$: builder = $title;
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<svelte:element this={level} use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</svelte:element>
{/if}
