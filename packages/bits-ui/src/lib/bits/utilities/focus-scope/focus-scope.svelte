<script lang="ts">
	import { boxWith } from "svelte-toolbelt";
	import { untrack } from "svelte";
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
		loop: untrack(() => loop),
		onCloseAutoFocus: boxWith(() => onCloseAutoFocus),
		onOpenAutoFocus: boxWith(() => onOpenAutoFocus),
		ref: untrack(() => ref),
	});
</script>

{@render focusScope?.({ props: focusScopeState.props })}
