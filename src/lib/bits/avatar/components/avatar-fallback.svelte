<script lang="ts">
	import { getAvatarRootContext } from "./state.svelte";
	import type { AvatarFallbackProps } from "./types";

	let { asChild = false, ...props } = $props<AvatarFallbackProps>();

	const rootState = getAvatarRootContext();
</script>

{#if asChild}
	<slot />
{:else}
	<span {...props} style={rootState.fallbackStyle}>
		<slot />
	</span>
{/if}
