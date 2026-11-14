<script lang="ts">
	import { getBitsConfig } from "bits-ui";

	let { id }: { id: string } = $props();
	const config = getBitsConfig();
</script>

<span data-testid={id}>{config.dir.current ?? "undefined"}</span>
