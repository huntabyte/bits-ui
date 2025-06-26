<script lang="ts">
	import DemoContainer from "$lib/components/demo-container.svelte";
	import TagsInputDemoContenteditable from "$lib/components/demos/tags-input-demo-contenteditable.svelte";
	import TagsInputDemo from "$lib/components/demos/tags-input-demo.svelte";
</script>

<div class="w-full max-w-[756px]">
	<DemoContainer>
		<TagsInputDemo />
	</DemoContainer>
	<DemoContainer>
		<TagsInputDemoContenteditable />
	</DemoContainer>
</div>
