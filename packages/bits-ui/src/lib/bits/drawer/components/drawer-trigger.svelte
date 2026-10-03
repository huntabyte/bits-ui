<script lang="ts" generics="Payload = never">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DrawerTriggerState } from "../drawer.svelte.js";
	import type { DrawerTriggerProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		disabled = false,
		tether,
		payload = undefined,
		...restProps
	}: DrawerTriggerProps<Payload> = $props();

	const triggerState = DrawerTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
		tether: boxWith(() => tether),
		payload: boxWith(() => payload),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
