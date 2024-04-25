<script lang="ts">
	import { useDialogRoot } from "../dialog.svelte.js";
	import type { RootProps } from "../index.js";
	import { box } from "$lib/internal/box.svelte.js";

	let { open = $bindable(false), onOpenChange, children }: RootProps = $props();

	useDialogRoot({
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
