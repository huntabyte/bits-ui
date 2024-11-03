<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TagsInputRootProps } from "../types.js";
	import { useTagsInputRoot } from "../tags-input.svelte.js";
	import TagsInputTagEditDescription from "./tags-input-tag-edit-description.svelte";
	import TagsInputAnnouncer from "./tags-input-announcer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		value = $bindable([]),
		ref = $bindable(null),
		onValueChange = noop,
		validate = () => true,
		controlledValue = false,
		delimiters = [","],
		required = false,
		name = "",
		children,
		child,
		...restProps
	}: TagsInputRootProps = $props();

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
		name: box.with(() => name),
		required: box.with(() => required),
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
