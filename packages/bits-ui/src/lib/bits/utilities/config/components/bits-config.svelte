<script lang="ts">
	import type { BitsConfigProps } from "$lib/bits/utilities/config/types.js";
	import { useBitsConfig } from "../bits-config.js";
	import { box } from "svelte-toolbelt";

	let { children, defaultPortalTo, defaultLocale }: BitsConfigProps = $props();

	useBitsConfig({
		defaultPortalTo: box.with(() => defaultPortalTo),
		defaultLocale: box.with(() => defaultLocale),
	});
</script>

{@render children?.()}
