<script lang="ts">
	import type { GroupProps } from "../index.js";
	import { useMenuGroup } from "../menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, ref = $bindable(), ...restProps }: GroupProps = $props();

	const groupState = useMenuGroup();
	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
