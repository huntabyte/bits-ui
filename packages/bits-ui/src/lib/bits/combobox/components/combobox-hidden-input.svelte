<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useComboboxHiddenInput } from "../combobox.svelte.js";
	import VisuallyHidden from "$lib/bits/utilities/visually-hidden/visually-hidden.svelte";

	type Props = {
		value?: string;
	};

	let { value = "" }: Props = $props();

	const hiddenInputState = useComboboxHiddenInput({
		value: box.with(() => value),
	});
</script>

<VisuallyHidden>
	{#if hiddenInputState.shouldRender}
		<input {...hiddenInputState.props} />
	{/if}
</VisuallyHidden>
