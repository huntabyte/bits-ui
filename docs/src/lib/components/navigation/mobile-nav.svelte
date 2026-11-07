<script lang="ts">
	import { Button } from "bits-ui";
	import MobileMenuIcon from "./mobile-menu-icon.svelte";

	let { open, onOpen }: { open: boolean; onOpen: () => void } = $props();
</script>

<Button.Root
	onclick={onOpen}
	aria-label="Open documentation menu"
	aria-expanded={open}
	aria-haspopup="dialog"
	class="mr-2 inline-flex size-10 shrink-0 items-center justify-center rounded-input text-foreground hover:bg-dark-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden md:hidden"
>
	<MobileMenuIcon {open} />
</Button.Root>
