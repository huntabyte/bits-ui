<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { FocusScopeImplProps } from "./types.js";
	import { useFocusScope } from "./useFocusScope.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id,
		trapped = false,
		loop = false,
		onDestroyAutoFocus = noop,
		onMountAutoFocus = noop,
		focusScope,
	}: FocusScopeImplProps = $props();

	const state = useFocusScope({
		trapped: box.with(() => trapped),
		loop: box.with(() => loop),
		onDestroyAutoFocus: box.with(() => onDestroyAutoFocus),
		onMountAutoFocus: box.with(() => onMountAutoFocus),
		id: box.with(() => id),
	});
</script>

{@render focusScope?.({ props: state.props })}
