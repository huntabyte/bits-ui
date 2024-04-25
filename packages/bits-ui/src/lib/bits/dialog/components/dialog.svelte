<script lang="ts">
	import { setDialogRootState } from "../dialog.svelte.js";
	import type { RootProps } from "../index.js";
	import { box } from "$lib/internal/box.svelte.js";

	let { open = $bindable(false), onOpenChange, children }: RootProps = $props();

	setDialogRootState({
		open: box(
			() => open,
			(v) => {
				if (v !== open) {
					onOpenChange?.(v);
					open = v;
				}
			}
		),
	});
</script>

{@render children?.()}
