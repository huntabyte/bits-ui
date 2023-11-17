<script lang="ts">
	import { Sun, MoonStars } from "@/components/icons";
	import { Button } from "@/components/ui/button";
	import { toggleMode, mode } from "mode-watcher";
</script>

<Button
	on:click={toggleMode}
	role="switch"
	aria-label="Light Switch"
	aria-checked={$mode === "light"}
	title="Toggle {$mode === 'dark' ? 'Dark' : 'Light'} Mode"
	variant="ghost"
	size="icon"
>
	{#if $mode === "light"}
		<MoonStars class="sq-6" aria-label="Moon" />
	{:else}
		<Sun class="sq-6" aria-label="Sun" />
	{/if}
</Button>
