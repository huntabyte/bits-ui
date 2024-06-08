<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useSelectContent, useSelectContentFrag } from "../select.svelte.js";
	import SelectProvider from "./select-provider.svelte";
	import SelectContentImpl from "./select-content-impl.svelte";
	import { useId } from "$lib/internal/useId.svelte.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";

	let {
		id = useId(),
		el = $bindable(),
		forceMount = false,
		position = "item-aligned",
		...restProps
	}: ContentProps = $props();

	const state = useSelectContentFrag({ id: box.with(() => id) });

	const contentContext = useSelectContent({
		id: box.with(() => id),
		position: box.with(() => position),
	});

	const isPresent = $derived(state.root.open.value || forceMount);
</script>

{#if isPresent}
	<PresenceLayer present={isPresent} {id}>
		{#snippet presence({ present })}
			{@const finalProps = restProps as any}
			<SelectContentImpl
				{present}
				{...finalProps}
				{el}
				{id}
				{position}
				context={contentContext}
			/>
		{/snippet}
	</PresenceLayer>
{:else if state.fragment.value}
	<Portal to={state.fragment.value}>
		<div {id}>
			<SelectProvider rootContext={state.root}>
				{@render restProps.children?.()}
			</SelectProvider>
		</div>
	</Portal>
{/if}
