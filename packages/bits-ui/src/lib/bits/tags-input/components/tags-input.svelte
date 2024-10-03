<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useTagsInputRoot } from "../tags-input.svelte.js";
	import TagsInputTagEditDescription from "./tags-input-tag-edit-description.svelte";
	import TagsInputAnnouncer from "./tags-input-announcer.svelte";
	import { useId } from "$lib/internal/useId.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		value = $bindable([]),
		ref = $bindable(null),
		onValueChange = noop,
		validate = () => true,
		controlledValue = false,
		delimiters = [","],
		blurBehavior = "none",
		editable = true,
		required = false,
		name = "",
		pasteBehavior = "add",
		children,
		child,
		...restProps
	}: RootProps = $props();

	const rootState = useTagsInputRoot({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				if (controlledValue) {
					onValueChange(v);
				} else {
					value = v;
					onValueChange(v);
				}
			}
		),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		delimiters: box.with(() => delimiters),
		blurBehavior: box.with(() => blurBehavior),
		editable: box.with(() => editable),
		name: box.with(() => name),
		required: box.with(() => required),
		pasteBehavior: box.with(() => pasteBehavior),
		validate: box.with(() => validate),
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

<TagsInputTagEditDescription />
<TagsInputAnnouncer />
