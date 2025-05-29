<script lang="ts">
	import type { BitsConfigProps } from "$lib/bits/utilities/config/types.js";
	import { useBitsConfig } from "../bits-config.svelte.js";
	import { box } from "svelte-toolbelt";

	let { children, defaultPortalTo }: BitsConfigProps = $props();

	useBitsConfig({
		defaultPortalTo: box.with(() => defaultPortalTo),
	});
</script>

{@render children?.()}
