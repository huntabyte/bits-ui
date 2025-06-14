<script lang="ts">
	import { type WritableBox, box, mergeProps } from "svelte-toolbelt";
	import { AccordionRootState } from "../accordion.svelte.js";
	import type { AccordionRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { watch } from "runed";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		disabled = false,
		children,
		child,
		type,
		value = $bindable(),
		ref = $bindable(null),
		id = createId(uid),
		onValueChange = noop,
		loop = true,
		orientation = "vertical",
		...restProps
	}: AccordionRootProps = $props();

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = type === "single" ? "" : [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = AccordionRootState.create({
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onValueChange(v as any);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		loop: box.with(() => loop),
		orientation: box.with(() => orientation),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
