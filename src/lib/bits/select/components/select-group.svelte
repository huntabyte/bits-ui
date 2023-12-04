<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setGroupCtx, getAttrs } from "../ctx.js";
	import type { GroupProps } from "../types.js";

	type $$Props = GroupProps;
	export let asChild: $$Props["asChild"] = false;

	const { group, id } = setGroupCtx();
	const attrs = getAttrs("group");

	$: builder = $group(id);
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
