<script lang="ts">
	import { derived } from "svelte/store";
	import { setSubMenuCtx } from "../ctx.js";
	import type { SubProps } from "../types.js";
	type $$Props = SubProps;

	export let positioning: $$Props["positioning"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let arrowSize: $$Props["arrowSize"] = undefined;

	const { updateOption, ids } = setSubMenuCtx({
		positioning,
		disabled,
		arrowSize
	});

	const idValues = derived([ids.menu, ids.trigger], ([$menuId, $triggerId]) => ({
		menu: $menuId,
		trigger: $triggerId
	}));

	$: updateOption("positioning", positioning);
	$: updateOption("disabled", disabled);
	$: updateOption("arrowSize", arrowSize);
</script>

<slot subIds={$idValues} />
