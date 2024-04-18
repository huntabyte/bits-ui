<script lang="ts">
	import type { RootProps } from "../index.js";

	let { open, children, onOpenChange }: RootProps = $props();
</script>

{@render children?.()}
