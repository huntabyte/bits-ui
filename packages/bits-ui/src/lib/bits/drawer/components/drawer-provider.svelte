<script lang="ts">
	import { DrawerProviderState } from "../drawer.svelte.js";
	import type { DrawerProviderProps } from "../types.js";

	let { children }: DrawerProviderProps = $props();

	DrawerProviderState.create();
</script>

{@render children?.()}
