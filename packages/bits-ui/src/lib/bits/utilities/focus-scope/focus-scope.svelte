<script lang="ts">
	import { boxWith } from "$lib/internal/box.svelte.js";
	import type { FocusScopeImplProps } from "./types.js";
	import { noop } from "$lib/internal/noop.js";
	import { FocusScope } from "./focus-scope.svelte.js";

	let {
		enabled = false,
		trapFocus = false,
		loop = false,
		onCloseAutoFocus = noop,
		onOpenAutoFocus = noop,
		focusScope,
		ref,
	}: FocusScopeImplProps = $props();

	const focusScopeState = FocusScope.use({
		enabled: boxWith(() => enabled),
		trap: boxWith(() => trapFocus),
		// svelte-ignore state_referenced_locally
		loop: loop,
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
		// svelte-ignore state_referenced_locally
		ref,
	});
</script>

{@render focusScope?.({ props: focusScopeState.props })}
