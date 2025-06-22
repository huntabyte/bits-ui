<script lang="ts">
	import { Checkbox, Label, useId } from "bits-ui";
	import Check from "phosphor-svelte/lib/Check";
	import Minus from "phosphor-svelte/lib/Minus";

	let myValue = $state<string[]>(["marketing", "news"]);
</script>

<Checkbox.Group
	class="flex flex-col gap-3"
	bind:value={myValue}
	name="notifications"
	onValueChange={console.log}
>
	<Checkbox.GroupLabel class="text-foreground-alt text-sm font-medium">
		Notifications
	</Checkbox.GroupLabel>
	<div class="flex flex-col gap-4">
		{@render MyCheckbox({ label: "Marketing", value: "marketing" })}
		{@render MyCheckbox({ label: "Promotions", value: "promotions" })}
		{@render MyCheckbox({ label: "News", value: "news" })}
		{@render MyCheckbox({ label: "Updates", value: "updates" })}
	</div>
</Checkbox.Group>

{#snippet MyCheckbox({ value, label }: { value: string; label: string })}
	{@const id = useId()}
	<div class="flex items-center">
		<Checkbox.Root
			{id}
			aria-labelledby="{id}-label"
			class="border-muted bg-foreground data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40 peer inline-flex size-[25px] items-center justify-center rounded-md border transition-all duration-150 ease-in-out active:scale-[0.98]"
			name="hello"
			{value}
		>
			{#snippet children({ checked, indeterminate })}
				<div class="text-background inline-flex items-center justify-center">
					{#if indeterminate}
						<Minus class="size-[15px]" weight="bold" />
					{:else if checked}
						<Check class="size-[15px]" weight="bold" />
					{/if}
				</div>
			{/snippet}
		</Checkbox.Root>
		<Label.Root
			id="{id}-label"
			for={id}
			class="pl-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{label}
		</Label.Root>
	</div>
{/snippet}
