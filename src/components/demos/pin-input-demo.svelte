<script lang="ts">
	import { PinInput } from "$lib";

	let value: string[] | undefined = ["5", "1", "3", "7"];
</script>

<PinInput.Root
	bind:value
	class="min-h-input flex h-full w-[176px] items-center gap-2 rounded-card-sm border border-border bg-background py-1 pl-[18px] pr-1.5 shadow-mini"
	type="text"
	disabled={true}
>
	<PinInput.Input class="flex items-center bg-inherit sq-5" />
	<PinInput.Input class="flex items-center bg-inherit sq-5" />
	<PinInput.Input class="flex items-center bg-inherit sq-5" />
	<PinInput.Input class="flex items-center bg-inherit sq-5" />
	<PinInput.HiddenInput />
</PinInput.Root>
