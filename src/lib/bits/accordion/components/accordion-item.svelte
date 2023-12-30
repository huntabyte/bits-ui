<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setItem, getAttrs } from "../ctx.js";
	import type { ItemProps } from "../types.js";
	type $$Props = ItemProps;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const { item, props } = setItem({ value, disabled });
	const attrs = getAttrs("item");

	$: builder = $item(props);
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
