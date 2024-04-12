<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setAvatarRootState } from "../state.svelte.js";

	let {
		delayMs,
		loadingStatus = $bindable(),
		onLoadingStatusChange,
		asChild,
		child,
		children,
		el = $bindable(),
		...restProps
	}: RootProps = $props();

	const rootState = setAvatarRootState({ delayMs, loadingStatus, onLoadingStatusChange });

	$effect.pre(() => {
		loadingStatus = rootState.loadingStatus;
	});

	$effect.pre(() => {
		if (delayMs !== undefined) {
			rootState.delayMs = delayMs;
		} else {
			rootState.delayMs = 0;
		}
	});
</script>

{#if asChild}
	{@render child?.(restProps)}
{:else}
	<div bind:this={el} {...restProps} {...rootState.attrs}>
		{@render children?.()}
	</div>
{/if}
