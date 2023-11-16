<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setItem, getAttrs } from "../ctx.js";
	import type { ItemProps } from "../types.js";
	type $$Props = ItemProps;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const { item, props } = setItem({ value, disabled });
	const attrs = getAttrs("item");

	$: builder = $item(props);
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
