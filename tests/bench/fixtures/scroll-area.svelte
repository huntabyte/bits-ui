<script lang="ts">
	import { ScrollArea } from "bits-ui";
	let {
		count,
		type = "always",
	}: { count: number; type?: "always" | "hover" | "auto" | "scroll" } = $props();
</script>

{#each { length: count }, i (i)}
	<ScrollArea.Root {type} style="width: 200px; height: 100px">
		<ScrollArea.Viewport style="width: 100%; height: 100%" data-bench="viewport">
			<div style="width: 400px; height: 400px">content {i}</div>
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar orientation="vertical"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
		<ScrollArea.Scrollbar orientation="horizontal"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
		<ScrollArea.Corner />
	</ScrollArea.Root>
{/each}
