<script lang="ts">
	import type { BitsConfigProps } from "#lib/bits/utilities/config/types.js";
	import { useBitsConfig } from "../bits-config.js";
	import { boxWith } from "svelte-toolbelt";

	let { children, defaultPortalTo, defaultLocale, dir }: BitsConfigProps = $props();

	useBitsConfig({
		dir: boxWith(() => dir),
		defaultPortalTo: boxWith(() => defaultPortalTo),
		defaultLocale: boxWith(() => defaultLocale),
	});
</script>

{@render children?.()}
