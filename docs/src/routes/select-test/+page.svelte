<script lang="ts">
	import SelectDemoItemAligned from "$lib/components/demos/select-demo-item-aligned.svelte";
</script>

<div style="min-height: 300vh; padding: 20px; display: flex; flex-direction: column; gap: 0;">
	<!-- Trigger near top -->
	<div style="padding-top: 40px;">
		<p style="margin-bottom: 8px; font-size: 12px; color: #888;">Trigger near top of viewport</p>
		<SelectDemoItemAligned />
	</div>

	<!-- Trigger in middle -->
	<div style="margin-top: 45vh;">
		<p style="margin-bottom: 8px; font-size: 12px; color: #888;">Trigger near middle of viewport</p>
		<SelectDemoItemAligned />
	</div>

	<!-- Trigger near bottom -->
	<div style="margin-top: 45vh;">
		<p style="margin-bottom: 8px; font-size: 12px; color: #888;">Trigger near bottom of viewport</p>
		<SelectDemoItemAligned />
	</div>
</div>
