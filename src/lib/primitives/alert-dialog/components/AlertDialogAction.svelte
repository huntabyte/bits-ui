<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ActionEvents, ActionProps } from "../types.js";

	type $$Props = ActionProps;
	type $$Events = ActionEvents;
	export let asChild = false;
	const action = ctx.getClose();
</script>

{#if asChild}
	<slot action={$action} />
{:else}
	<button use:melt={$action} {...$$restProps} on:click on:keydown on:m-click on:m-keydown>
		<slot />
	</button>
{/if}
