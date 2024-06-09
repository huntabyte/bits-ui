<script lang="ts">
	import { untrack } from "svelte";
	import type { WritableBox } from "svelte-toolbelt";
	import type { ScrollDownButtonProps } from "../index.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		mounted,
		...restProps
	}: ScrollDownButtonProps & {
		mounted: WritableBox<boolean>;
		style: string;
	} = $props();

	$effect(() => {
		untrack(() => {
			mounted.value = true;
		});

		return () => {
			mounted.value = false;
		};
	});
</script>

{#if asChild}
	{@render child?.({ props: restProps })}
{:else}
	<div {...restProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
