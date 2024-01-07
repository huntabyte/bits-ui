<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx";
	import type { LabelProps } from "../types";

	type $$Props = LabelProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { label }
	} = getCtx();

	const attrs = getAttrs("label");

	$: builder = $label;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<label use:melt={builder} {...$$restProps} for={builder.id}>
		<slot />
	</label>
{/if}
