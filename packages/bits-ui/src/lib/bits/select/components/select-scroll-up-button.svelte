<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SelectScrollUpButtonProps } from "../types.js";
	import { SelectScrollUpButtonState } from "../select.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { Mounted } from "$lib/bits/utilities/index.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		delay = () => 50,
		child,
		children,
		...restProps
	}: SelectScrollUpButtonProps = $props();

	const scrollButtonState = SelectScrollUpButtonState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		delay: box.with(() => delay),
	});

	const mergedProps = $derived(mergeProps(restProps, scrollButtonState.props));
</script>

{#if scrollButtonState.canScrollUp}
	<Mounted bind:mounted={scrollButtonState.scrollButtonState.mounted} />
	{#if child}
		{@render child({ props: restProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
