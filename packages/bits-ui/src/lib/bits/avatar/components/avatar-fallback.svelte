<script lang="ts">
	import type { FallbackProps } from "../index.js";
	import { getAvatarFallbackState } from "../avatar.svelte.js";

	let { asChild, children, child, el = $bindable(), ...restProps }: FallbackProps = $props();

	const fallbackState = getAvatarFallbackState();

	const mergedProps = {
		...fallbackState.props,
		...restProps,
	};
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<span bind:this={el} {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
