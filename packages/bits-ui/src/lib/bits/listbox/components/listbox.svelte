<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useListboxRoot } from "../listbox.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		type,
		value = $bindable(),
		onValueChange = noop,
		disabled = false,
		autoFocus = false,
		loop = false,
		orientation = "vertical",
		children,
	}: RootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	useListboxRoot({
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				onValueChange(v as any);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: box.with(() => disabled),
		autoFocus: box.with(() => autoFocus),
		loop: box.with(() => loop),
		orientation: box.with(() => orientation),
	});
</script>

{@render children?.()}
