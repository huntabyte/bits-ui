<script lang="ts">
	import { Portal, BitsConfig } from "bits-ui";

	let target: HTMLElement | undefined = $state();
</script>

<BitsConfig defaultPortalTo={target}>
	<div bind:this={target} class="bg-background flex rounded-md border p-2">
		<section class="flex size-12 items-center justify-center bg-blue-200">
			<div class="size-8 bg-blue-400"></div>
			<Portal>
				<!-- This content will be lifted out of the section and made a child of {target} -->
				<div class="size-12 bg-blue-600"></div>
			</Portal>
		</section>
	</div>
</BitsConfig>
