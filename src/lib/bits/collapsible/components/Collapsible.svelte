<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let forceVisible: $$Props["forceVisible"] = false;
	export let disabled: $$Props["disabled"] = undefined;
	export let open: $$Props["open"] = undefined;
	export let onOpenChange: $$Props["onOpenChange"] = undefined;
	export let asChild = false;

	const {
		elements: { root },
		states: { open: localOpen },
		updateOption
	} = ctx.set({
		disabled,
		forceVisible,
		defaultOpen: open,
		onOpenChange: ({ next }) => {
			open = next;
			onOpenChange?.(next);
			return next;
		}
	});

	$: open !== undefined && localOpen.set(open);

	$: updateOption("disabled", disabled);
	$: updateOption("forceVisible", forceVisible);
</script>

{#if asChild}
	<slot builder={$root} />
{:else}
	{@const builder = $root}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
