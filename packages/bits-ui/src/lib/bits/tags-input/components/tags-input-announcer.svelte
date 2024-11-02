<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useTagsInputAnnouncer } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import {
		type BitsPrimitiveDivAttributes,
		type WithChild,
		type Without,
		mergeProps,
	} from "$lib/shared/index.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";

	type Props = WithChild & Without<BitsPrimitiveDivAttributes, WithChild>;

	let { id = useId(), ref = $bindable(null) }: Props = $props();

	const announcerState = useTagsInputAnnouncer({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(announcerState.props));
</script>

<Portal>
	<div {...mergedProps}>
		{#if announcerState.root.message}
			{announcerState.root.message}
		{/if}
	</div>
</Portal>
