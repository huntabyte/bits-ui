<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import { useComboboxRoot } from "../combobox.svelte.js";
	import type { RootProps } from "../index.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		value = $bindable(),
		onValueChange = noop,
		name = "",
		disabled = false,
		type,
		open = $bindable(false),
		onOpenChange = noop,
		loop = false,
		scrollAlignment = "nearest",
		required = false,
		children,
	}: RootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	useComboboxRoot({
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				onValueChange(v as any);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: box.with(() => disabled),
		required: box.with(() => required),
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		loop: box.with(() => loop),
		scrollAlignment: box.with(() => scrollAlignment),
		name: box.with(() => name),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
