<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setAvatarRootState } from "../avatar.svelte.js";
	import { box } from "$lib/internal/box.svelte.js";

	let {
		delayMs: delayMsProp = 0,
		loadingStatus: loadingStatusProp = $bindable("loading"),
		onLoadingStatusChange,
		asChild,
		child,
		children,
		el = $bindable(),
		...restProps
	}: RootProps = $props();

	const loadingStatus = box(
		() => loadingStatusProp,
		(v) => {
			loadingStatusProp = v;
			onLoadingStatusChange?.(v);
		}
	);

	const delayMs = box(() => delayMsProp);

	const rootState = setAvatarRootState({
		delayMs,
		loadingStatus,
	});

	const mergedProps = {
		...rootState.props,
		...restProps,
	};
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
