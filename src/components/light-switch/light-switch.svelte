<script lang="ts">
	import { Moon, Sun } from "lucide-svelte";
	import { onMount } from "svelte";
	import { Button, buttonVariants } from "@/components/ui/button";
	import { cn } from "@/utils";
	import {
		getModeOsPrefers,
		modeCurrent,
		setModeCurrent,
		setModeUserPrefers
	} from "./light-switch";

	type OnKeyDownEvent = KeyboardEvent & {
		currentTarget: EventTarget & HTMLButtonElement;
	};

	function onToggleHandler(): void {
		$modeCurrent = !$modeCurrent;
		setModeUserPrefers($modeCurrent);
		setModeCurrent($modeCurrent);
	}

	// A11y Input Handlers
	function onKeyDown(event: OnKeyDownEvent): void {
		// Enter/Space triggers selection event
		if (["Enter", "Space"].includes(event.code)) {
			event.preventDefault();
			event.currentTarget.click();
		}
	}

	// Lifecycle
	onMount(() => {
		// Sync lightswitch with the theme
		if (!("modeCurrent" in localStorage)) {
			setModeCurrent(getModeOsPrefers());
		}
	});
</script>

<Button
	on:click={onToggleHandler}
	on:keydown={onKeyDown}
	role="switch"
	aria-label="Light Switch"
	aria-checked={$modeCurrent}
	title="Toggle {$modeCurrent === true ? 'Dark' : 'Light'} Mode"
	variant="ghost"
	size="icon"
>
	{#if $modeCurrent}
		<Moon class="sq-5" aria-label="Moon" />
	{:else}
		<Sun class="sq-5" aria-label="Sun" />
	{/if}
</Button>
