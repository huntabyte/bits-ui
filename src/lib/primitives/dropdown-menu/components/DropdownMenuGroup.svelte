<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { GroupProps } from "../types.js";
	type $$Props = GroupProps;

	const { group, id } = ctx.setGroup();
</script>

<div use:melt={$group(id)} {...$$restProps}>
	<slot />
</div>
