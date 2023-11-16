<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setGroup, getAttrs } from "../ctx.js";
	import type { GroupProps } from "../types.js";

	type $$Props = GroupProps;

	export let asChild: $$Props["asChild"] = false;

	const { group, id } = setGroup();

	$: builder = $group(id);
	const attrs = getAttrs("group");

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
