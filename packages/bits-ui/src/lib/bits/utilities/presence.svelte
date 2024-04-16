<script lang="ts">
	import type { Snippet } from "svelte";
	import { Box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { usePresence } from "$lib/internal/use-presence.svelte.js";

	type Props = {
		/**
		 * The presence status.
		 */
		present: boolean;

		/**
		 * Whether to force mount the component.
		 */
		forceMount?: boolean;

		presence?: Snippet<[{ present: { value: boolean } }]>;

		node: Box<HTMLElement | null>;
	};

	let {
		present: presentProp,
		forceMount: forceMountProp = false,
		presence,
		node,
	}: Props = $props();

	const forceMount = readonlyBox(() => forceMountProp);

	const present = readonlyBox(() => presentProp);
	const isPresent = usePresence(present, node);
</script>

{#if forceMount.value || present.value || isPresent.value}
	{@render presence?.({ present: isPresent })}
{/if}
