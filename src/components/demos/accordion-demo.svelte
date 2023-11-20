<script lang="ts">
	import { Accordion } from "$lib";
	import { CaretDown } from "phosphor-svelte";
	import { slide } from "svelte/transition";

	const items = [
		{
			title: "Feature Overview",
			content:
				"Task management, messaging, file sharing, progress tracking, and reporting for your team."
		},
		{
			title: "Advantages of our Platform",
			content:
				"Experience improved productivity, enhanced communication, and customizable project views for project execution."
		},
		{
			title: "Effective Implementation Strategies",
			content:
				"Define clear goals, provide training, encourage adoption, and iterate based on feedback."
		}
	];
</script>

<Accordion.Root class="w-full sm:max-w-[70%]" multiple>
	{#each items as item, i}
		<Accordion.Item value="${i}" class="group border-b border-dark-10 px-1.5">
			<Accordion.Header>
				<Accordion.Trigger
					class="flex w-full flex-1 items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180 "
				>
					{item.title}
					<span
						class="inline-flex h-8 w-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-dark-10"
					>
						<CaretDown class="h-[18px] w-[18px] transition-all duration-200" />
					</span>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content
				transition={slide}
				transitionConfig={{ duration: 200 }}
				class="pb-[25px] text-sm tracking-[-0.01em]"
			>
				{item.content}
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
