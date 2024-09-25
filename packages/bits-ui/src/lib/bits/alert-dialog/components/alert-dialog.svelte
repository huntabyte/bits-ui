<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { useDialogRoot } from "$lib/bits/dialog/dialog.svelte.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		controlledOpen = false,
		children,
	}: RootProps = $props();

	useDialogRoot({
		variant: box.with(() => "alert-dialog"),
		open: box.with(
			() => open,
			(v) => {
				if (controlledOpen) {
					onOpenChange(v);
				} else {
					open = v;
					onOpenChange(v);
				}
			}
		),
	});
</script>

{@render children?.()}
