<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { GroupProps } from "../types.js";
	type $$Props = GroupProps;

	export let asChild = false;
	const { group, id } = ctx.setGroup();
	$: builder = $group(id);
	const attrs = ctx.getAttrs("group");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
