<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let delayMs: $$Props["delayMs"] = undefined;
	export let loadingStatus: $$Props["loadingStatus"] = undefined;
	export let onLoadingStatusChange: $$Props["onLoadingStatusChange"] = undefined;
	export let asChild = false;

	const {
		states: { loadingStatus: localLoadingStatus },
		updateOption
	} = ctx.set({
		src: "",
		delayMs,
		onLoadingStatusChange: ({ next }) => {
			loadingStatus = next;
			onLoadingStatusChange?.(next);
			return next;
		}
	});

	$: loadingStatus !== undefined && localLoadingStatus.set(loadingStatus);
	$: updateOption("delayMs", delayMs);
</script>

{#if asChild}
	<slot />
{:else}
	<div {...$$restProps}>
		<slot />
	</div>
{/if}
