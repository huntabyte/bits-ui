<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { Events, Props } from "../types.js";

	type $$Props = Props;
	type $$Events = Events;
	const {
		elements: { root }
	} = ctx.get();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

<label use:melt={$root} {...$$restProps} on:m-mousedown>
	<slot />
</label>
