<script lang="ts">
	import type { FocusScopeProps } from "./types.js";
	import { useFocusScope } from "./useFocusScope.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id,
		trapped = false,
		loop = false,
		onDestroyAutoFocus = noop,
		onMountAutoFocus = noop,
		focusScope,
	}: FocusScopeProps = $props();

	const state = useFocusScope({
		trapped: readonlyBox(() => trapped),
		loop: readonlyBox(() => loop),
		onDestroyAutoFocus: readonlyBox(() => onDestroyAutoFocus),
		onMountAutoFocus: readonlyBox(() => onMountAutoFocus),
		id: readonlyBox(() => id),
	});
</script>

{@render focusScope?.({ props: state.props })}
