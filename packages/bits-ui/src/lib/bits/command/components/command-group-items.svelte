<script lang="ts">
	import { mergeProps, useId } from "bits-ui";
	import { box } from "svelte-toolbelt";
	import type { GroupItemsProps } from "../index.js";
	import { useCommandGroupItems } from "../command.svelte.js";

	let { id = useId(), ref = $bindable(null), children, ...restProps }: GroupItemsProps = $props();

	const groupItemsState = useCommandGroupItems({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupItemsState.props));
</script>

<div {...mergedProps}>
	{@render children?.()}
</div>
