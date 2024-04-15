<script lang="ts">
	import type { Snippet } from "svelte";
	import { Box, box, readonlyBox } from "$lib/internal/box.svelte.js";
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

		presence?: Snippet<[{ present: { value: boolean }; node: Box<HTMLElement | undefined> }]>;

		el?: HTMLElement;
	};

	let {
		present: presentProp,
		forceMount: forceMountProp = false,
		presence,
		el = $bindable(),
	}: Props = $props();

	const present = box(
		() => presentProp,
		(v) => (presentProp = v)
	);
	const forceMount = readonlyBox(() => forceMountProp);

	const node = box(
		() => el,
		(v) => (el = v)
	);

	const isPresent = usePresence(present, node);

	// $inspect(el);
	// $inspect(isPresent.value);

	$inspect(node.value);
</script>

{#if forceMount.value || present.value || isPresent.value}
	{@render presence?.({ present: isPresent, node })}
{/if}
