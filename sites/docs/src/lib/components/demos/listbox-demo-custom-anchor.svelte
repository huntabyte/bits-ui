<script lang="ts">
	import DemoContainer from "../demo-container.svelte";
	import ListboxDemoCustom from "./listbox-demo-custom.svelte";

	let customAnchor = $state<HTMLElement>(null!);
</script>

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<div class="flex items-center gap-6">
		<div class="rounded-md border p-3" bind:this={customAnchor}>Custom Anchor</div>
		<ListboxDemoCustom
			contentProps={{
				customAnchor,
			}}
		/>
	</div>
</DemoContainer>
