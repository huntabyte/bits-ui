<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { FocusScopeImplProps } from "./types.js";
	import { useFocusScope } from "./useFocusScope.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id,
		trapFocus = false,
		loop = false,
		onDestroyAutoFocus = noop,
		onMountAutoFocus = noop,
		focusScope,
	}: FocusScopeImplProps = $props();

	const focusScopeState = useFocusScope({
		trapFocus: box.with(() => trapFocus),
		loop: box.with(() => loop),
		onDestroyAutoFocus: box.with(() => onDestroyAutoFocus),
		onMountAutoFocus: box.with(() => onMountAutoFocus),
		id: box.with(() => id),
	});
</script>

{@render focusScope?.({ props: focusScopeState.props })}
