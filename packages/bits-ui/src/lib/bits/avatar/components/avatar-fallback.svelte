<script lang="ts">
	import type { FallbackProps } from "../index.js";
	import { getAvatarFallbackState } from "../avatar.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		style = {},
		...restProps
	}: FallbackProps = $props();

	const fallbackState = getAvatarFallbackState({ style: readonlyBox(() => style) });

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
