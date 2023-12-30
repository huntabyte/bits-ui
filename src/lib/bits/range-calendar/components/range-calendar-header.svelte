<script lang="ts">
	import { getAttrs } from "../ctx.js";
	import type { HeaderProps } from "../types.js";

	type $$Props = HeaderProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const attrs = getAttrs("header");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<header bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</header>
{/if}
