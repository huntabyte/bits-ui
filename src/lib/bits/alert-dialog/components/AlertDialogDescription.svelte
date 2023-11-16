<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { DescriptionProps } from "../types.js";

	type $$Props = DescriptionProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { description },
		ids
	} = getCtx();

	const attrs = getAttrs("description");

	$: if (id) {
		ids.description.set(id);
	}
	$: builder = $description;
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
