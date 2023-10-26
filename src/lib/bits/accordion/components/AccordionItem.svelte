<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setItem, getAttrs } from "../ctx.js";
	import type { ItemProps } from "../types.js";
	type $$Props = ItemProps;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild = false;
	const { item, props } = setItem({ value, disabled });

	$: builder = $item(props);
	const attrs = getAttrs("item");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
