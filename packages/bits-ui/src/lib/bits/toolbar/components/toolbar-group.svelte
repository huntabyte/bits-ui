<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import { mergeProps } from "svelte-toolbelt";
	import type { ToolbarGroupProps } from "../types.js";
	import { ToolbarGroupState } from "../toolbar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { watch } from "runed";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		type,
		disabled = false,
		child,
		children,
		...restProps
	}: ToolbarGroupProps = $props();

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

	const groupState = ToolbarGroupState.create({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
