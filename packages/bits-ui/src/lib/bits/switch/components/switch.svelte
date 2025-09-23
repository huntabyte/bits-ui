<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { SwitchRootProps } from "../types.js";
	import { SwitchRootState } from "../switch.svelte.js";
	import SwitchInput from "./switch-input.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		child,
		children,
		ref = $bindable(null),
		id = createId(uid),
		disabled = false,
		required = false,
		checked = $bindable(false),
		value = "on",
		name = undefined,
		type = "button",
		onCheckedChange = noop,
		...restProps
	}: SwitchRootProps = $props();

	const rootState = SwitchRootState.create({
		checked: boxWith(
			() => checked,
			(v) => {
				checked = v;
				onCheckedChange?.(v);
			}
		),
		disabled: boxWith(() => disabled ?? false),
		required: boxWith(() => required),
		value: boxWith(() => value),
		name: boxWith(() => name),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</button>
{/if}

<SwitchInput />
