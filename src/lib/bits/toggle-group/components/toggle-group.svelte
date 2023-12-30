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
	export let el: $$Props["el"] = undefined;

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
				if (JSON.stringify(next) !== JSON.stringify(value)) {
					onValueChange?.(next);
					value = next;
				}
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

	$: value !== undefined &&
		localValue.set(Array.isArray(value) ? [...value] : value);

	$: updateOption("disabled", disabled);
	$: updateOption("loop", loop);
	$: updateOption("type", type);
	$: updateOption("orientation", orientation);

	$: builder = $root;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
