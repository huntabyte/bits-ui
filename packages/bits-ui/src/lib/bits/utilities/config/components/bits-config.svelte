<script lang="ts">
	import type { BitsConfigProps } from "$lib/bits/utilities/config/types.js";
	import { useBitsConfig } from "../bits-config.svelte.js";
	import { box } from "svelte-toolbelt";

	let { children, ...restProps }: BitsConfigProps = $props();

	useBitsConfig({
		defaultPortalTo: box.with(() => restProps.defaultPortalTo),
	});
</script>

{@render children?.()}
