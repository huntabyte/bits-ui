<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
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
		forceVisible: true,
		defaultOpen: open,
		onOpenChange: ({ next }) => {
			if (open !== next) {
				onOpenChange?.(next);
				open = next;
			}
			return next;
		}
	});
	const attrs = getAttrs("root");

	$: open !== undefined && localOpen.set(open);
	$: updateOption("disabled", disabled);
	$: builder = $root;
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
