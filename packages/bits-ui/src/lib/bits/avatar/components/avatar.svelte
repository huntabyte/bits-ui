<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setAvatarRootState } from "../avatar.svelte.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		delayMs = 0,
		loadingStatus = $bindable("loading"),
		onLoadingStatusChange,
		asChild,
		child,
		children,
		el = $bindable(),
		style = {},
		...restProps
	}: RootProps = $props();

	const rootState = setAvatarRootState({
		delayMs: readonlyBox(() => delayMs),
		loadingStatus: box(
			() => loadingStatus,
			(v) => {
				loadingStatus = v;
				onLoadingStatusChange?.(v);
			}
		),
		style: readonlyBox(() => style),
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
