<script lang="ts">
	import { untrack } from "svelte";
	import type { WritableBox } from "svelte-toolbelt";
	import type { ScrollUpButtonProps } from "../index.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(),
		mounted,
		...restProps
	}: ScrollUpButtonProps & {
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
	<div {...restProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
