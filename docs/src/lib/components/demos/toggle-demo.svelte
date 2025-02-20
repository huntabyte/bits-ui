<script lang="ts">
	import { Toggle } from "bits-ui";
	import LockKeyOpen from "phosphor-svelte/lib/LockKeyOpen";

	let unlocked = $state(false);
	const code = $derived(unlocked ? "B1T5" : "••••");
</script>

<div
	class="min-h-input rounded-card-sm border-border bg-background-alt shadow-mini flex h-full w-[176px] items-center gap-2 border py-1 pl-[18px] pr-1.5"
>
	<div
		class="font-alt text-end text-[19px] tracking-[13.87px] {unlocked
			? 'text-foreground'
			: 'text-muted-foreground'}"
	>
		{code}
	</div>
	<Toggle.Root
		aria-label="toggle code visibility"
		class="bg-background-alt hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center rounded-[9px] transition-all active:scale-[0.98]"
		bind:pressed={unlocked}
	>
		<LockKeyOpen class="size-6" />
	</Toggle.Root>
</div>
