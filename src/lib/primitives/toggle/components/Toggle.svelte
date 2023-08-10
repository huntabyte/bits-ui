<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let disabled: $$Props["disabled"] = undefined;
	export let pressed: $$Props["pressed"] = undefined;
	export let onPressedChange: $$Props["onPressedChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { root },
		states: { pressed: localPressed },
		updateOption
	} = ctx.set({
		disabled,
		defaultPressed: pressed,
		onPressedChange: ({ next }) => {
			pressed = next;
			onPressedChange?.(next);
			return next;
		}
	});

	$: pressed !== undefined && localPressed.set(pressed);
	$: updateOption("disabled", disabled);
</script>

{#if asChild}
	<slot toggle={$root} />
{:else}
	<button use:melt={$root} {...$$restProps}>
		<slot toggle={$root} />
	</button>
{/if}
