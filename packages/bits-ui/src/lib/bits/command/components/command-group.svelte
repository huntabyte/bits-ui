<script lang="ts">
	import { mergeProps, useId } from "bits-ui";
	import { box } from "svelte-toolbelt";
	import type { CommandGroupProps } from "../types.js";
	import { useCommandGroupContainer } from "../command.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = "",
		forceMount = false,
		children,
		...restProps
	}: CommandGroupProps = $props();

	const groupState = useCommandGroupContainer({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		forceMount: box.with(() => forceMount),
		value: box.with(() => value),
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

<div>
	<div {...mergedProps}>
		{@render children?.()}
	</div>
</div>
