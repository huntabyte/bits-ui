<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let checked: $$Props["checked"] = undefined;
	export let onCheckedChange: $$Props["onCheckedChange"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let name: $$Props["name"] = undefined;
	export let value: $$Props["value"] = undefined;

	const {
		elements: { root },
		states: { checked: localChecked },
		updateOption
	} = ctx.set({
		disabled,
		name,
		value,
		defaultChecked: checked,
		onCheckedChange: ({ next }) => {
			checked = next;
			onCheckedChange?.(next);
			return next;
		}
	});

	$: checked !== undefined && localChecked.set(checked);
	$: updateOption("disabled", disabled);
	$: updateOption("name", name);
	$: updateOption("value", value);
</script>

<button use:melt={$root} {...$$restProps}>
	<slot />
</button>
