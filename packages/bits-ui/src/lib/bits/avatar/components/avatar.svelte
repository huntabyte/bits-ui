<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { AvatarRootProps } from "../types.js";
	import { AvatarRootState } from "../avatar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		delayMs = 0,
		loadingStatus = $bindable("loading"),
		onLoadingStatusChange,
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: AvatarRootProps = $props();

	const rootState = AvatarRootState.create({
		delayMs: boxWith(() => delayMs),
		loadingStatus: boxWith(
			() => loadingStatus,
			(v) => {
				if (loadingStatus !== v) {
					loadingStatus = v;
					onLoadingStatusChange?.(v);
				}
			}
		),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
