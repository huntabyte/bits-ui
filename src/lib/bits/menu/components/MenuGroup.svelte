<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setGroupCtx, getAttrs } from "../ctx.js";
	import type { GroupProps } from "../types.js";
	type $$Props = GroupProps;
	export let asChild: $$Props["asChild"] = false;

	const { group, id } = setGroupCtx();
	const attrs = getAttrs("group");

	$: builder = $group(id);
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
