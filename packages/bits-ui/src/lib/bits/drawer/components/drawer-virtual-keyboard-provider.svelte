<script lang="ts">
	import { DrawerVirtualKeyboardContext } from "../drawer.svelte.js";
	import type { DrawerVirtualKeyboardProviderProps } from "../types.js";

	let { enabled = true, children }: DrawerVirtualKeyboardProviderProps = $props();
	DrawerVirtualKeyboardContext.set({
		get enabled() {
			return enabled;
		},
	});
</script>

{@render children?.()}
