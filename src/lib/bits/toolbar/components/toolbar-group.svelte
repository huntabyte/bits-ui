<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setGroupCtx, getAttrs } from "../ctx.js";
	import type { GroupProps } from "../types.js";

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
		updateOption
	} = setGroupCtx<T>({
		disabled,
		type,
		defaultValue: value,
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

	const attrs = getAttrs("group");

	$: value !== undefined && localValue.set(value);

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
