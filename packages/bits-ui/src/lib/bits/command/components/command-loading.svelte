<script lang="ts">
	import { mergeProps, useId } from "bits-ui";
	import { box } from "svelte-toolbelt";
	import type { LoadingProps } from "../index.js";
	import { useCommandLoading } from "../command.svelte.js";

	let {
		progress = 0,
		id = useId(),
		ref = $bindable(null),
		children,
		...restProps
	}: LoadingProps = $props();

	const loadingState = useCommandLoading({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		progress: box.with(() => progress),
	});

	const mergedProps = $derived(mergeProps(restProps, loadingState.props));
</script>

<div {...mergedProps}>
	{@render children?.()}
</div>
