<script lang="ts">
	import { Checkbox } from "bits-ui";

	let { onFormSubmit }: { onFormSubmit?: () => void } = $props();
</script>

<main>
	<form
		id="ext"
		onsubmit={(e) => {
			e.preventDefault();
			onFormSubmit?.();
		}}
	></form>
	<Checkbox.Root type="submit" form="ext" data-testid="root" />
</main>
