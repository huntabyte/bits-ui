<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ThumbProps } from "../index.js";
	import { useSwitchThumb } from "../switch.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: ThumbProps = $props();

	const thumbState = useSwitchThumb({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, thumbState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, checked: thumbState.root.checked.current })}
{:else}
	<span {...mergedProps}>
		{@render children?.({ checked: thumbState.root.checked.current })}
	</span>
{/if}
