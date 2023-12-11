<script lang="ts">
	import { AvatarRootState, setAvatarRootContext } from "./state.svelte";
	import type { AvatarProps } from "./types";

	let {
		delayMs = 0,
		loadingStatus = "loading",
		asChild = false,
		...props
	} = $props<AvatarProps>();

	const rootState = new AvatarRootState();

	setAvatarRootContext(rootState);

	$effect(() => {
		rootState.delayMs = delayMs;
		rootState.loadingStatus = loadingStatus;
	});
</script>

{#if asChild}
	<slot />
{:else}
	<div {...props}>
		<slot />
	</div>
{/if}
