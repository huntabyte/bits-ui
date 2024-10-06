<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogRoot } from "../dialog.svelte.js";
	import type { DialogRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		controlledOpen = false,
		children,
	}: DialogRootProps = $props();

	useDialogRoot({
		variant: box.with(() => "dialog"),
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
