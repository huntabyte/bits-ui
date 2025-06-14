<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { CommandLabelState } from "../command.svelte.js";

	import type { WithChildren } from "$lib/internal/types.js";
	import { createId } from "$lib/internal/create-id.js";
	import { mergeProps } from "svelte-toolbelt";
	import type { BitsPrimitiveLabelAttributes, WithElementRef } from "$lib/shared/index.js";

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		...restProps
	}: WithChildren<WithElementRef<BitsPrimitiveLabelAttributes>> = $props();

	const labelState = CommandLabelState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

<label {...mergedProps}>
	{@render children?.()}
</label>
