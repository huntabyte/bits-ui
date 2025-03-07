<script lang="ts">
	import { cn } from "$lib/utils/styles.js";
	import { Accordion, useId, Button } from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";
	import { SvelteSet } from "svelte/reactivity";

	let activeStep = $state("");
	let completedSteps = new SvelteSet<string>();
</script>

{#snippet MyAccordionHeader({ value, title }: { value: string; title: string })}
	{@const isCompleted = completedSteps.has(value)}
	<Accordion.Header>
		<Accordion.Trigger
			class="flex w-full flex-1 select-none items-center justify-between gap-3 py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
		>
			<div
				class={cn(
					"border-foreground/30 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
					isCompleted ? "text-foreground" : "text-muted-foreground"
				)}
			>
				{isCompleted ? "✓" : value}
			</div>
			<span class="w-full text-left">
				{title}
			</span>
			<span
				class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
			>
				<CaretDown class="size-[18px] transition-transform duration-200" />
			</span>
		</Accordion.Trigger>
	</Accordion.Header>
{/snippet}

{#snippet InputField({
	label,
	placeholder,
	type = "text",
}: {
	label: string;
	placeholder: string;
	type?: string;
})}
	{@const id = useId()}
	<div class="flex flex-col gap-1">
		<label class="select-none text-sm font-medium" for={id}>{label}</label>
		<input
			{type}
			{id}
			name={label}
			{placeholder}
			class="rounded-card-sm border-border-input bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus-override inline-flex h-10 w-full items-center border px-4 text-base sm:text-sm"
		/>
	</div>
{/snippet}

<Accordion.Root bind:value={activeStep} class="w-full sm:max-w-[70%]" type="single">
	<Accordion.Item value="1" class="border-dark-10 group border-b px-1.5">
		{@render MyAccordionHeader({ title: "Shipping Information", value: "1" })}
		<Accordion.Content
			class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm tracking-[-0.01em]"
		>
			<div class="flex flex-col gap-4 pb-6 pt-2">
				<div class="grid grid-cols-2 gap-4">
					{@render InputField({ label: "First Name", placeholder: "John" })}
					{@render InputField({ label: "Last Name", placeholder: "Doe" })}
					<div class="col-span-2">
						{@render InputField({
							label: "Address",
							placeholder: "1234 Elm Street",
						})}
					</div>
					{@render InputField({ label: "City", placeholder: "Tampa" })}
					{@render InputField({ label: "ZIP", placeholder: "123456" })}
				</div>
				<div class="pt-2">
					<Button.Root
						class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-10 select-none items-center justify-center whitespace-nowrap px-[21px] text-sm font-medium transition-all hover:cursor-pointer active:scale-[0.98]"
						onclick={() => {
							completedSteps.add("1");
							activeStep = "2";
						}}
					>
						Continue to Payment
					</Button.Root>
				</div>
			</div>
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="2" class="border-dark-10 group border-b px-1.5">
		{@render MyAccordionHeader({ title: "Payment Method", value: "2" })}
		<Accordion.Content
			class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm tracking-[-0.01em]"
		>
			<div class="flex flex-col gap-4 pb-6 pt-2">
				<div class="grid grid-cols-3 gap-4">
					<div class="col-span-3">
						{@render InputField({
							label: "Card Number",
							placeholder: "4242 4242 4242 4242",
						})}
					</div>
					{@render InputField({ label: "Exp. Month", placeholder: "MM" })}
					{@render InputField({ label: "Exp. Year", placeholder: "YY" })}
					{@render InputField({ label: "CVC", placeholder: "123" })}
				</div>
				<div class="pt-2">
					<Button.Root
						class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-10 select-none items-center justify-center whitespace-nowrap px-[21px] text-sm font-medium transition-all hover:cursor-pointer active:scale-[0.98]"
						onclick={() => {
							completedSteps.add("2");
							activeStep = "3";
						}}
					>
						Continue to Review
					</Button.Root>
				</div>
			</div>
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="3" class="border-dark-10 group border-b px-1.5">
		{@render MyAccordionHeader({ title: "Payment Method", value: "3" })}
		<Accordion.Content
			class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden pb-6 text-sm tracking-[-0.01em]"
		>
			<div class="flex flex-col gap-4 pt-2">
				<div class="rounded-lg border p-4">
					<h4 class="mb-2 font-medium">Order Summary</h4>
					<div class="flex flex-col gap-2">
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">Product 1</span>
							<span>$29.99</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">Product 2</span>
							<span>$49.99</span>
						</div>
						<div class="flex justify-between text-sm">
							<span class="text-muted-foreground">Shipping</span>
							<span>$4.99</span>
						</div>
						<div class="mt-2 flex justify-between border-t pt-2 font-medium">
							<span>Total</span>
							<span>$84.97</span>
						</div>
					</div>
				</div>
				<div class="pt-2">
					<Button.Root
						class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-10 select-none items-center justify-center whitespace-nowrap px-[21px] text-sm font-medium transition-all hover:cursor-pointer active:scale-[0.98]"
						onclick={() => {
							completedSteps.add("3");
							activeStep = "";
						}}
					>
						Place Order
					</Button.Root>
				</div>
			</div>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
