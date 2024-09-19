<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setItem } from "../ctx.js";
	import type { ItemProps } from "../index.js";
	type $$Props = ItemProps;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { item },
		propsStore,
		getAttrs,
	} = setItem({ value, disabled });
	const attrs = getAttrs("item");

	$: propsStore.set({ value, disabled });
	$: builder = $item({ ...$propsStore, disabled });
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
