<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDialogRoot } from "../dialog.svelte.js";
	import type { RootProps } from "../index.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		controlledOpen = false,
		children,
	}: RootProps = $props();

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
