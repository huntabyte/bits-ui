<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectContentProps } from "../types.js";
	import { useSelectContent, useSelectContentFrag } from "../select.svelte.js";
	import SelectProvider from "./select-provider.svelte";
	import SelectContentImpl from "./select-content-impl.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		forceMount = false,
		position = "floating",
		...restProps
	}: SelectContentProps = $props();

	const contentState = useSelectContentFrag();

	const contentContext = useSelectContent({
		id: box.with(() => id),
		position: box.with(() => position),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const isPresent = $derived(contentState.root.open.current || forceMount);
</script>

{#if isPresent}
	<PresenceLayer present={isPresent} {id}>
		{#snippet presence({ present })}
			{@const finalProps = restProps as any}
			<SelectContentImpl
				{present}
				{...finalProps}
				{ref}
				{id}
				{position}
				context={contentContext}
			/>
		{/snippet}
	</PresenceLayer>
{:else if contentState.root.contentFragment}
	<Portal to={contentState.root.contentFragment}>
		<div>
			<SelectProvider rootContext={contentState.root}>
				{@render restProps.children?.()}
			</SelectProvider>
		</div>
	</Portal>
{/if}
