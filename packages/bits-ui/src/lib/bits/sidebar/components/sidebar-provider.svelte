<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { SidebarProviderState } from "../sidebar.svelte.js";
	import type { SidebarProviderProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		open = $bindable(true),
		onOpenChange = noop,
		openMobile = $bindable(false),
		onOpenMobileChange = noop,
		disabled = false,
		isMobile,
		mobileBreakpoint = 768,
		keyboardShortcut = "b",
		children,
		child,
		...restProps
	}: SidebarProviderProps = $props();

	const providerState = SidebarProviderState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		openMobile: boxWith(
			() => openMobile,
			(v) => {
				openMobile = v;
				onOpenMobileChange(v);
			}
		),
		disabled: boxWith(() => disabled),
		isMobile: boxWith(() => isMobile),
		mobileBreakpoint: boxWith(() => mobileBreakpoint),
		keyboardShortcut: boxWith(() => keyboardShortcut),
	});

	const mergedProps = $derived(mergeProps(restProps, providerState.props));
</script>

<svelte:window onkeydown={providerState.onkeydown} />

{#if child}
	{@render child({ props: mergedProps, ...providerState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(providerState.snippetProps)}
	</div>
{/if}
