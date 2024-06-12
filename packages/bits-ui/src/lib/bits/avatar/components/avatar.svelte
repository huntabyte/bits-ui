<script lang="ts">
	import { box } from "svelte-toolbelt";
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
		ref = $bindable(),
		...restProps
	}: RootProps = $props();

	const rootState = useAvatarRoot({
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

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
