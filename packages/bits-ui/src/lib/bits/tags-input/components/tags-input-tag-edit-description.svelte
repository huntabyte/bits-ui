<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useTagsInputTagEditDescription } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import {
		type PrimitiveDivAttributes,
		type WithChild,
		type Without,
		mergeProps,
	} from "$lib/shared/index.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";

	type Props = WithChild & Without<PrimitiveDivAttributes, WithChild>;

	let { id = useId(), ref = $bindable(null) }: Props = $props();

	const editDescriptionState = useTagsInputTagEditDescription({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(editDescriptionState.props));
</script>

<Portal>
	<div {...mergedProps}>
		{editDescriptionState.description}
	</div>
</Portal>
