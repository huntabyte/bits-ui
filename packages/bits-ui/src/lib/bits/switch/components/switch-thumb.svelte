<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SwitchThumbProps } from "../types.js";
	import { SwitchThumbState } from "../switch.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: SwitchThumbProps = $props();

	const thumbState = SwitchThumbState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, thumbState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...thumbState.snippetProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.(thumbState.snippetProps)}
	</span>
{/if}
