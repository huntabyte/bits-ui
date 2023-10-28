<script lang="ts">
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

	$: updateOption("positioning", positioning);
	$: updateOption("disabled", disabled);
	$: updateOption("arrowSize", arrowSize);
</script>

<slot subIds={ids} />
