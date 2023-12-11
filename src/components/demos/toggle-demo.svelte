<script lang="ts">
	import { LockKeyOpen } from "phosphor-svelte";
	import { Toggle } from "$lib";

	let unlocked = false;
	$: code = unlocked ? "1985" : "••••";
</script>

<div
	class="min-h-input flex h-full w-[176px] items-center gap-2 rounded-card-sm border border-border bg-background py-1 pl-[18px] pr-1.5 shadow-mini"
>
	<div
		class="text-end font-alt text-[19px] tracking-[13.87px] {unlocked
			? 'text-foreground'
			: 'text-muted-foreground'}"
	>
		{code}
	</div>
	<Toggle.Root
		aria-label="toggle code visibility"
		class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted active:scale-98 active:bg-dark-10 data-[state=on]:bg-muted data-[state=off]:text-foreground-alt data-[state=on]:text-foreground active:data-[state=on]:bg-dark-10"
		bind:pressed={unlocked}
	>
		<LockKeyOpen class="sq-6" />
	</Toggle.Root>
</div>
