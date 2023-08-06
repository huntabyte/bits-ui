<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { HeaderProps } from "../types.js";

	type $$Props = HeaderProps;
	export let level: HeaderProps["level"] = 3;
	const header = ctx.getHeader();
</script>

<div use:melt={$header(level)} {...$$restProps}>
	<slot />
</div>
