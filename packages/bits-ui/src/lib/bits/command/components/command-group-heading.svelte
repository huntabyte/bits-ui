<script lang="ts">
	import { mergeProps, useId } from "bits-ui";
	import { box } from "svelte-toolbelt";
	import { useCommandGroupHeading } from "../command.svelte.js";
	import type { GroupHeadingProps } from "../index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		...restProps
	}: GroupHeadingProps = $props();

	const headingState = useCommandGroupHeading({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headingState.props));
</script>

<div {...mergedProps}>
	{@render children?.()}
</div>
