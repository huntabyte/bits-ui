<script lang="ts">
	import { getCalendarAttrs } from "../ctx.js";
	import type { HeaderProps } from "../types.js";
	type $$Props = HeaderProps;
	export let asChild: $$Props["asChild"] = false;

	const attrs = getCalendarAttrs("header");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<header {...$$restProps} {...attrs}>
		<slot {attrs} />
	</header>
{/if}
