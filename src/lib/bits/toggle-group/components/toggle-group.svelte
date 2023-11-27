<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type T = $$Generic<"single" | "multiple">;
	type $$Props = Props<T>;

	export let type: $$Props["type"] = "single" as T;
	export let disabled: $$Props["disabled"] = undefined;
	export let loop: $$Props["loop"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let orientation: $$Props["orientation"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = setCtx<T>({
		disabled,
		type,
		defaultValue: value,
		loop,
		orientation,
		onValueChange: (({ next }: { next: $$Props["value"] }) => {
			if (Array.isArray(next)) {
				onValueChange?.(next);
				value = next;
				return next;
			}

			if (value !== next) {
				onValueChange?.(next);
				value = next;
			}
			return next;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}) as any
	});

	const attrs = getAttrs("root");

	$: value !== undefined && localValue.set(value);

	$: updateOption("disabled", disabled);
	$: updateOption("loop", loop);
	$: updateOption("type", type);
	$: updateOption("orientation", orientation);

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