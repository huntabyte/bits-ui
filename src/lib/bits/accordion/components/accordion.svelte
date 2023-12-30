<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { Props } from "../types.js";
	import { setCtx, getAttrs } from "../ctx.js";

	type Multiple = $$Generic<boolean>;
	type $$Props = Props<Multiple>;

	export let multiple: $$Props["multiple"] = false as Multiple;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root },
		states: { value: localValue },
		updateOption
	} = setCtx({
		multiple,
		disabled,
		defaultValue: value,
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

	// Svelte types get weird here saying set expects something that is both string and string[].
	$: value !== undefined &&
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		localValue.set(Array.isArray(value) ? [...value] : (value as any));

	$: updateOption("multiple", multiple);
	$: updateOption("disabled", disabled);

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
