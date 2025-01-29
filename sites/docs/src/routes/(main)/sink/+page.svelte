<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Dialog, Popover } from "bits-ui";

	const frameworks = [
		{
			value: "sveltekit",
			label: "SvelteKit",
		},
		{
			value: "next.js",
			label: "Next.js",
		},
		{
			value: "nuxt.js",
			label: "Nuxt.js",
		},
		{
			value: "remix",
			label: "Remix",
		},
		{
			value: "astro",
			label: "Astro",
		},
	];

	let open = $state(false);
	let value = $state("");
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(frameworks.find((f) => f.value === value)?.label);

	// // We want to refocus the trigger button when the user selects
	// // an item from the list so users can continue navigating the
	// // rest of the form with the keyboard.
	// function closeAndFocusTrigger() {
	// 	open = false;
	// 	tick().then(() => {
	// 		triggerRef.focus();
	// 	});
	// }
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>Edit profile</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Title>Edit profile</Dialog.Title>
		<Popover.Root bind:open>
			<Popover.Trigger bind:ref={triggerRef}>
				{#snippet child({ props })}
					<Button
						variant="outline"
						class="w-[200px] justify-between"
						{...props}
						role="combobox"
						aria-expanded={open}
					>
						{selectedValue || "Select a framework..."}
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-[200px] p-0">Testing</Popover.Content>
		</Popover.Root>
	</Dialog.Content>
</Dialog.Root>
