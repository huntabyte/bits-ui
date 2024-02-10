<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { LabelProps } from "../types.js";

	type $$Props = LabelProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { label },
		getAttrs,
	} = getCtx();

	const attrs = getAttrs("label");

	$: builder = $label;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<label bind:this={el} use:melt={builder} {...$$restProps} for={builder.id}>
		<slot />
	</label>
{/if}
