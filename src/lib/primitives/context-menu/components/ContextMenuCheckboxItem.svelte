<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { CheckboxItemProps } from "../types.js";

	type $$Props = CheckboxItemProps;
	export let checked: $$Props["checked"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let onCheckedChange: $$Props["onCheckedChange"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { checkboxItem },
		states: { checked: localChecked },
		updateOption
	} = ctx.setCheckboxItem({
		disabled,
		defaultChecked: checked,
		onCheckedChange: ({ next }) => {
			checked = next;
			onCheckedChange?.(next);
			return next;
		}
	});

	$: checked !== undefined && localChecked.set(checked);
	$: updateOption("disabled", disabled);
</script>

{#if asChild}
	<slot checkboxItem={$checkboxItem} />
{:else}
	<div use:melt={$checkboxItem} {...$$restProps}>
		<slot checkboxItem={$checkboxItem} />
	</div>
{/if}
