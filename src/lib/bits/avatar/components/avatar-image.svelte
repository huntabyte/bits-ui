<script lang="ts">
	import type { AvatarImageProps } from "./types";
	import { getAvatarRootContext } from "./state.svelte";

	let { src, asChild = false, ...props } = $props<AvatarImageProps>();

	const rootState = getAvatarRootContext();

	$effect(() => {
		rootState.initImage(src);
	});
</script>

{#if asChild}
	<slot />
{:else}
	<img {src} {...props} style={rootState.imageStyle} />
{/if}
