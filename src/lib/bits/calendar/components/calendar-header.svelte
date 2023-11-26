<script lang="ts">
	import { getAttrs } from "../ctx.js";
	import type { HeaderProps } from "../types.js";
	type $$Props = HeaderProps;
	export let asChild: $$Props["asChild"] = false;

	const attrs = getAttrs("header");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<header {...$$restProps} {...attrs}>
		<slot {attrs} />
	</header>
{/if}
