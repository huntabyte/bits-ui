<script lang="ts">
	import { cn } from "#lib/utils/styles.js";
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
			class="flex w-full flex-1 items-center justify-between gap-3 py-5 text-[15px] font-medium transition-all select-none [&[data-state=open]>span>svg]:rotate-180"
		>
			<div
				class={cn(
					"flex size-6 shrink-0 items-center justify-center rounded-full border border-foreground/30 text-xs font-medium",
					isCompleted ? "text-foreground" : "text-muted-foreground"
				)}
			>
				{isCompleted ? "✓" : value}
			</div>
			<span class="w-full text-left">
				{title}
			</span>
			<span
				class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent hover:bg-dark-10"
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
		<label class="text-sm font-medium select-none" for={id}>{label}</label>
		<input
			{type}
			{id}
			name={label}
			{placeholder}
			class="focus-override inline-flex h-10 w-full items-center rounded-card-sm border border-border-input bg-background px-4 text-base placeholder:text-foreground-alt/50 hover:border-dark-40 sm:text-sm"
		/>
	</div>
{/snippet}

<Accordion.Root bind:value={activeStep} class="w-full sm:max-w-[70%]" type="single">
	<Accordion.Item value="1" class="group border-b border-dark-10 px-1.5">
		{@render MyAccordionHeader({ title: "Shipping Information", value: "1" })}
		<Accordion.Content
			class="overflow-hidden text-sm tracking-[-0.01em] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		>
			<div class="flex flex-col gap-4 pt-2 pb-6">
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
						class="inline-flex h-10 items-center justify-center rounded-input bg-dark px-[21px] text-sm font-medium whitespace-nowrap text-background shadow-mini transition-all select-none hover:cursor-pointer hover:bg-dark/95 active:scale-[0.98]"
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
	<Accordion.Item value="2" class="group border-b border-dark-10 px-1.5">
		{@render MyAccordionHeader({ title: "Payment Method", value: "2" })}
		<Accordion.Content
			class="overflow-hidden text-sm tracking-[-0.01em] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		>
			<div class="flex flex-col gap-4 pt-2 pb-6">
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
						class="inline-flex h-10 items-center justify-center rounded-input bg-dark px-[21px] text-sm font-medium whitespace-nowrap text-background shadow-mini transition-all select-none hover:cursor-pointer hover:bg-dark/95 active:scale-[0.98]"
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
	<Accordion.Item value="3" class="group border-b border-dark-10 px-1.5">
		{@render MyAccordionHeader({ title: "Payment Method", value: "3" })}
		<Accordion.Content
			class="overflow-hidden pb-6 text-sm tracking-[-0.01em] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
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
						class="inline-flex h-10 items-center justify-center rounded-input bg-dark px-[21px] text-sm font-medium whitespace-nowrap text-background shadow-mini transition-all select-none hover:cursor-pointer hover:bg-dark/95 active:scale-[0.98]"
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
