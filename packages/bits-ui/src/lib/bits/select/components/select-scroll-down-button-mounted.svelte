<script lang="ts">
	import { untrack } from "svelte";
	import type { WritableBox } from "svelte-toolbelt";
	import type { ScrollDownButtonProps } from "../index.js";

	let {
		children,
		child,
		mounted,
		...restProps
	}: ScrollDownButtonProps & {
		mounted: WritableBox<boolean>;
		style: string;
	} = $props();

	$effect(() => {
		untrack(() => {
			mounted.current = true;
		});

		return () => {
			mounted.current = false;
		};
	});
</script>

{#if child}
	{@render child?.({ props: restProps })}
{:else}
	<div {...restProps}>
		{@render children?.()}
	</div>
{/if}
