<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Events, Props } from "../types.js";

	type T = $$Generic<"single" | "multiple">;

	type $$Props = Props<T>;
	type $$Events = Events;
	export let kind: $$Props["kind"] = "single" as T;
	export let disabled: $$Props["disabled"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let asChild = false;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = setCtx<T>({
		disabled,
		type: kind,
		defaultValue: value,
		onValueChange: (({ next }: { next: $$Props["value"] }) => {
			if (value !== next) {
				onValueChange?.(next);
				value = next;
			}
			return next;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}) as any
	});

	$: value !== undefined && localValue.set(value);
	$: updateOption("disabled", disabled);

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
