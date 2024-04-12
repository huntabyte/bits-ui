<script lang="ts">
	import type { FallbackProps } from "../index.js";
	import { getAvatarFallbackState } from "../state.svelte.js";

	let { asChild, children, child, el = $bindable(), ...restProps }: FallbackProps = $props();

	const fallbackState = getAvatarFallbackState();
</script>

{#if asChild}
	{@render child?.(restProps)}
{:else}
	<span bind:this={el} {...restProps} {...fallbackState.attrs}>
		{@render children?.()}
	</span>
{/if}
