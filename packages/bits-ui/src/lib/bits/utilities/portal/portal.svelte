<script lang="ts">
	import { getAllContexts, mount, unmount } from "svelte";
	import PortalConsumer from "./portal-consumer.svelte";
	import type { PortalProps } from "./types.js";
	import { isBrowser } from "$lib/internal/is.js";

	let { to = "body", children, disabled }: PortalProps = $props();

	const context = getAllContexts();

	let target = $derived(getTarget());

	function getTarget() {
		if (!isBrowser) return null;
		let target: HTMLElement | null | DocumentFragment | Element = null;
		if (typeof to === "string") {
			target = document.querySelector(to);
			if (target === null) {
				throw new Error(`Target element "${to}" not found.`);
			}
		} else if (to instanceof HTMLElement || to instanceof DocumentFragment) {
			target = to;
		} else {
			throw new TypeError(
				`Unknown portal target type: ${
					to === null ? "null" : typeof to
				}. Allowed types: string (CSS selector) or HTMLElement.`
			);
		}

		return target;
	}

	let instance: any;

	$effect(() => {
		if (!target || disabled) {
			return unmount(instance);
		}
		instance = mount(PortalConsumer, { target: target as any, props: { children }, context });

		return () => {
			unmount(instance);
		};
	});
</script>

{#if disabled}
	{@render children?.()}
{/if}
