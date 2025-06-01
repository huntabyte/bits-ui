<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useSelectHiddenInput } from "../select.svelte.js";
	import type { HTMLInputAttributes } from "svelte/elements";
	import HiddenInput from "$lib/bits/utilities/hidden-input.svelte";

	let {
		value = $bindable(""),
		autocomplete,
	}: { value?: string } & Omit<HTMLInputAttributes, "value"> = $props();

	const hiddenInputState = useSelectHiddenInput({
		value: box.with(() => value),
	});
</script>

{#if hiddenInputState.shouldRender}
	<HiddenInput {...hiddenInputState.props} bind:value {autocomplete} />
{/if}
