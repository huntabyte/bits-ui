<script lang="ts">
	import { Separator } from "$lib/index.js";

	let { ...restProps }: Separator.RootProps = $props();
</script>

<main>
	<Separator.Root data-testid="root" {...restProps} />
</main>
