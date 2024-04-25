<script lang="ts">
	import type { RootProps } from "../index.js";
	import { useAvatarRoot } from "../avatar.svelte.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
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
		delayMs: readonlyBox(() => delayMs),
		loadingStatus: box(
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
