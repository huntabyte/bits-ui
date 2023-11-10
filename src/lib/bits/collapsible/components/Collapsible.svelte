<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let forceVisible: $$Props["forceVisible"] = false;
	export let disabled: $$Props["disabled"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { root },
		states: { open: localOpen },
		updateOption
	} = setCtx({
		disabled,
		forceVisible,
		defaultOpen: open,
		onOpenChange: ({ next }) => {
			if (open !== next) {
				onOpenChange?.(next);
				open = next;
			}
			return next;
		}
	});

	$: open !== undefined && localOpen.set(open);

	$: updateOption("disabled", disabled);
	$: updateOption("forceVisible", forceVisible);

	$: builder = $root;
	const attrs = getAttrs("root");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
