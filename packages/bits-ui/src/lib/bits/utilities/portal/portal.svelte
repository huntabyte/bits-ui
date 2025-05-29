<script lang="ts">
	import { getAllContexts, mount, unmount } from "svelte";
	import { DEV } from "esm-env";
	import { watch } from "runed";
	import PortalConsumer from "./portal-consumer.svelte";
	import type { PortalProps, PortalTarget } from "./types.js";
	import { isBrowser } from "$lib/internal/is.js";
	import { getBitsConfig } from "$lib/bits/utilities/config/bits-config.svelte.js";

	let { to = "body", children, disabled }: PortalProps = $props();

	const context = getAllContexts();
	const bitsConfig = getBitsConfig();

	let target = $derived(getTarget());

	function getTarget() {
		if (!isBrowser || disabled) return null;
		let localTo: PortalTarget | null = to;
		if (bitsConfig.defaultPortalTo?.current !== undefined) {
			localTo = bitsConfig.defaultPortalTo.current;
		}
		let localTarget: HTMLElement | null | DocumentFragment | Element = null;
		if (typeof localTo === "string") {
			localTarget = document.querySelector(localTo);
			if (localTarget === null) {
				if (DEV) {
					throw new Error(`Target element "${localTo}" not found.`);
				}
			}
		} else if (localTo instanceof HTMLElement || localTo instanceof DocumentFragment) {
			localTarget = localTo;
		} else {
			if (DEV) {
				throw new TypeError(
					`Unknown portal target type: ${
						localTo === null ? "null" : typeof localTo
					}. Allowed types: string (query selector), HTMLElement, or DocumentFragment.`
				);
			}
		}

		return localTarget;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let instance: any;

	function unmountInstance() {
		if (instance) {
			unmount(instance);
			instance = null;
		}
	}

	watch([() => target, () => disabled], ([target, disabled]) => {
		if (!target || disabled) {
			unmountInstance();
			return;
		}
		instance = mount(PortalConsumer, {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			target: target as any,
			props: { children },
			context,
		});

		return () => {
			unmountInstance();
		};
	});
</script>

{#if disabled}
	{@render children?.()}
{/if}
