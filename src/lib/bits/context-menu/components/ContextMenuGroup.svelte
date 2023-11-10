<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setGroup, getAttrs } from "../ctx.js";
	import type { GroupProps } from "../types.js";
	type $$Props = GroupProps;
	export let asChild: $$Props["asChild"] = false;
	const { group, id } = setGroup();
	$: builder = $group(id);
	const attrs = getAttrs("group");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
