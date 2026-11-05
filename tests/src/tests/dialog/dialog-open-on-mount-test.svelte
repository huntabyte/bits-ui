<script lang="ts">
	import { Dialog } from "bits-ui";
	import Opener from "./dialog-open-on-mount-opener.svelte";

	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<!-- opens the dialog after the Root is constructed but before its effects first run -->
	<Opener onmount={() => (open = true)} />
	<Dialog.Portal>
		<Dialog.Content data-testid="content">content</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
