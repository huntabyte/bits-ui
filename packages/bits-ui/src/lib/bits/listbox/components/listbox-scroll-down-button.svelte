<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ScrollDownButtonProps } from "../index.js";
	import { useListboxScrollDownButton } from "../listbox.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { Mounted } from "$lib/bits/utilities/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: ScrollDownButtonProps = $props();

	let mounted = $state(false);

	const scrollDownButtonState = useListboxScrollDownButton({
		id: box.with(() => id),
		mounted: box.with(() => mounted),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, scrollDownButtonState.props));
</script>

{#if scrollDownButtonState.canScrollDown}
	<Mounted onMountedChange={(m) => (mounted = m)} />
	{#if child}
		{@render child({ props: restProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
