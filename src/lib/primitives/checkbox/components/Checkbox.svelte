<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Props, Events } from "../types.js";

	type $$Props = Props;
	type $$Events = Events;
	export let checked: $$Props["checked"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let name: $$Props["name"] = undefined;
	export let required: $$Props["required"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onCheckedChange: $$Props["onCheckedChange"] = undefined;

	const {
		elements: { root, input },
		states: { checked: localChecked },
		updateOption
	} = ctx.set({
		defaultChecked: checked,
		disabled,
		name,
		required,
		value,
		onCheckedChange: ({ next }) => {
			onCheckedChange?.(next);
			checked = next;
			return next;
		}
	});

	$: checked !== undefined && localChecked.set(checked);

	$: updateOption("disabled", disabled);
	$: updateOption("name", name);
	$: updateOption("required", required);
	$: updateOption("value", value);
</script>

<button use:melt={$root} {...$$restProps} on:click on:keydown on:m-click on:m-keydown>
	<slot />
	<input use:melt={$input} />
</button>
