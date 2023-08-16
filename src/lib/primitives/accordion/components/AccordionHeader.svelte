<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { HeaderProps } from "../types.js";

	type $$Props = HeaderProps;
	export let level = 3;
	export let asChild: HeaderProps["asChild"] = false;
	const heading = ctx.get().elements.heading;
</script>

{#if asChild}
	<slot builder={$heading(level)} />
{:else}
	<div use:melt={$heading(level)} {...$$restProps}>
		<slot builder={$heading(level)} />
	</div>
{/if}
