<script lang="ts">
	import { TextB } from "phosphor-svelte";
	import { Toggle } from "$lib";
</script>

<Toggle.Root
	aria-label="toggle bold"
	class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98 data-[state=on]:bg-muted"
>
	<TextB class="h-6 w-6" />
</Toggle.Root>
