<script lang="ts">
	import DemoContainer from "../demo-container.svelte";
	import SelectDemoCustom from "./select-demo-custom.svelte";
</script>

<DemoContainer size="sm" wrapperClass="rounded-bl-card rounded-br-card mt-4" class="gap-4">
	<div class="flex flex-col items-center gap-4">
		<SelectDemoCustom contentProps={{ position: "floating" }} value="neon-green" />
		<pre>position="floating"</pre>
	</div>
	<div class="flex flex-col items-center gap-4">
		<SelectDemoCustom contentProps={{ position: "item-aligned" }} value="neon-green" />
		<pre>position="item-aligned"</pre>
	</div>
</DemoContainer>
