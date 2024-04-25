<script lang="ts">
	import { box } from "runed";
	import type { RootProps } from "../index.js";
	import { useAvatarRoot } from "../avatar.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		delayMs = 0,
		loadingStatus = $bindable("loading"),
		onLoadingStatusChange,
		asChild,
		child,
		children,
		el = $bindable(),
		...restProps
	}: RootProps = $props();

	const state = useAvatarRoot({
		delayMs: box.with(() => delayMs),
		loadingStatus: box.with(
			() => loadingStatus,
			(v) => {
				if (loadingStatus !== v) {
					loadingStatus = v;
					onLoadingStatusChange?.(v);
				}
			}
		),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
