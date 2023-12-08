<script lang="ts">
	import { PinInput } from "$lib";
	import { Toggle } from "$lib";
	import { LockKey, LockKeyOpen } from "phosphor-svelte";

	let value: string[] | undefined = ["5", "1", "3", "7"];

	let unlocked = false;
	let pinInputType: "text" | "password" = "password";
	$: pinInputType = unlocked ? "text" : "password";
</script>

<PinInput.Root
	bind:value
	class="min-h-input flex h-full w-[176px] items-center gap-2 rounded-card-sm border border-border bg-background py-1 pl-[18px] pr-1.5 shadow-mini"
	type={pinInputType}
>
	<PinInput.Input
		class="w-5 bg-inherit text-center font-alt text-[19px] text-foreground"
	/>
	<PinInput.Input
		class="w-5 bg-inherit text-center font-alt text-[19px] text-foreground"
	/>
	<PinInput.Input
		class="w-5 bg-inherit text-center font-alt text-[19px] text-foreground"
	/>
	<PinInput.Input
		class="w-5 bg-inherit text-center font-alt text-[19px] text-foreground"
	/>
	<PinInput.HiddenInput />
	<Toggle.Root
		aria-label="toggle code visibility"
		class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted active:data-[state=on]:bg-dark-10"
		bind:pressed={unlocked}
	>
		{#if unlocked}
			<LockKey class="sq-6" />
		{:else}
			<LockKeyOpen class="sq-6" />
		{/if}
	</Toggle.Root>
</PinInput.Root>
