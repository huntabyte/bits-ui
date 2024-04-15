<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setAvatarRootState } from "../avatar.svelte.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		delayMs: delayMsProp = 0,
		loadingStatus: loadingStatusProp = $bindable("loading"),
		onLoadingStatusChange,
		asChild,
		child,
		children,
		el = $bindable(),
		style: styleProp = {},
		...restProps
	}: RootProps = $props();

	const loadingStatus = box(
		() => loadingStatusProp,
		(v) => {
			loadingStatusProp = v;
			onLoadingStatusChange?.(v);
		}
	);

	const style = readonlyBox(() => styleProp);

	const delayMs = readonlyBox(() => delayMsProp);

	const rootState = setAvatarRootState({
		delayMs,
		loadingStatus,
		style,
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
