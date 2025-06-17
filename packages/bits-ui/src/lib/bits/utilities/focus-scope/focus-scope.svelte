<script lang="ts">
	import { box } from "svelte-toolbelt";
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
		enabled: box.with(() => enabled),
		trap: box.with(() => trapFocus),
		loop: loop,
		onCloseAutoFocus: box.with(() => onCloseAutoFocus),
		onOpenAutoFocus: box.with(() => onOpenAutoFocus),
		ref,
	});

	// const focusScopeState = useFocusScope({
	// 	enabled: box.with(() => trapFocus),
	// 	loop: box.with(() => loop),
	// 	onCloseAutoFocus: box.with(() => onCloseAutoFocus),
	// 	onOpenAutoFocus: box.with(() => onOpenAutoFocus),
	// 	id: box.with(() => id),
	// 	forceMount: box.with(() => forceMount),
	// 	ref,
	// });
</script>

{@render focusScope?.({ props: focusScopeState.props })}
