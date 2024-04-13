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
</script>

{#if asChild}
	{@render child?.(restProps)}
{:else}
	<div bind:this={el} {...restProps} {...rootState.attrs}>
		{@render children?.()}
	</div>
{/if}
