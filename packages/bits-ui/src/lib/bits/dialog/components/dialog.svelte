<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogRoot } from "../dialog.svelte.js";
	import type { RootProps } from "../index.js";

	let { open = $bindable(false), onOpenChange, children }: RootProps = $props();

	useDialogRoot({
		open: box.with(
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
