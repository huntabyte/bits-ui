<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { MenubarRootProps } from "../types.js";
	import { MenubarRootState } from "../menubar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		children,
		child,
		ref = $bindable(null),
		value = $bindable(""),
		dir = "ltr",
		loop = true,
		onValueChange = noop,
		...restProps
	}: MenubarRootProps = $props();

	const rootState = MenubarRootState.create({
		id: boxWith(() => id),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange?.(v);
			}
		),
		dir: boxWith(() => dir),
		loop: boxWith(() => loop),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
