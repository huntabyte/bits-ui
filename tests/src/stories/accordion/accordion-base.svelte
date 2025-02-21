<script lang="ts">
	import {
		Accordion,
		type AccordionItemPropsWithoutHTML,
		type AccordionRootPropsWithoutHTML,
	} from "bits-ui";
	import CaretDown from "phosphor-svelte/lib/CaretDown";
	import cn from "clsx";

	let {
		items,
		orientation = "vertical",
		...rest
	}: AccordionRootPropsWithoutHTML & {
		items: Array<
			{
				value: string;
				title: string;
				content: string;
			} & AccordionItemPropsWithoutHTML
		>;
	} = $props();
</script>

<Accordion.Root {...rest} class="w-full sm:max-w-[70%]">
	{#each items as item (item.value)}
		<Accordion.Item
			value={item.value}
			disabled={item.disabled}
			class={cn(
				"border-dark-10 group border-b px-1.5",
				orientation === "horizontal" && "flex-1"
			)}
		>
			<Accordion.Header>
				<Accordion.Trigger
					class="flex w-full flex-1 select-none items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
				>
					<span class="w-full text-left">
						{item.title}
					</span>
					<span
						class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all"
					>
						<CaretDown class="size-[18px] transition-all duration-200" />
					</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content
				class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm tracking-[-0.01em]"
			>
				<div class="pb-[25px]">
					{item.content}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
