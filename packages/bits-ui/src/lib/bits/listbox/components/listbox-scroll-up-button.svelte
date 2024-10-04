<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ListboxScrollUpButtonProps } from "../types.js";
	import { useListboxScrollUpButton } from "../listbox.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { Mounted } from "$lib/bits/utilities/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: ListboxScrollUpButtonProps = $props();

	let mounted = $state(false);

	const scrollDownButtonState = useListboxScrollUpButton({
		id: box.with(() => id),
		mounted: box.with(() => mounted),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, scrollDownButtonState.props));
</script>

{#if scrollDownButtonState.canScrollUp}
	<Mounted onMountedChange={(m) => (mounted = m)} />
	{#if child}
		{@render child({ props: restProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
