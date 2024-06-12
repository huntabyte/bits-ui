<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { DescriptionProps } from "../index.js";

	type $$Props = DescriptionProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { description },
		ids,
		getAttrs,
	} = getCtx();

	const attrs = getAttrs("description");

	$: if (id) {
		ids.description.set(id);
	}
	$: builder = $description;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={ref} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
