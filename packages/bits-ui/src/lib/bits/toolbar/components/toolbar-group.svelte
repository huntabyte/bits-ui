<script lang="ts">

	import { melt } from "@melt-ui/svelte";
	import { setGroupCtx } from "../ctx.js";
	import type { GroupProps } from "../index.js";
	import { arraysAreEqual } from "$lib/internal/arrays.js";

	type T = $$Generic<"single" | "multiple">;
	type $$Props = GroupProps<T>;

	export let type: $$Props["type"] = "single" as T;
	export let disabled: $$Props["disabled"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { group },
		states: { value: localValue },
		updateOption,
		getAttrs,
	} = setGroupCtx<T>({
		disabled,
		type,
		defaultValue: value,
		onValueChange: (({ next }: { next: $$Props["value"] }) => {
			if (Array.isArray(next)) {
				if (!Array.isArray(value) || !arraysAreEqual(value, next)) {
					onValueChange?.(next);
					value = next;
					return next;
				}
				return next;
			}

			if (value !== next) {
				onValueChange?.(next);
				value = next;
			}
			return next;
		}) as any,
	});

	const attrs = getAttrs("group");

	$: value !== undefined &&
		localValue.set(Array.isArray(value) ? ([...value] as $$Props["value"]) : (value as any));

	$: updateOption("disabled", disabled);
	$: updateOption("type", type);

	$: builder = $group;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
