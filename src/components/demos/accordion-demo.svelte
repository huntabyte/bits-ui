<script lang="ts">
	import { Accordion } from "$lib";
	import { CaretDown } from "phosphor-svelte";
	import { slide } from "svelte/transition";

	const items = [
		{
			title: "Feature Overview",
			content:
				"Our platform offers task management, team messaging, file sharing, progress tracking,and reporting for streamlined project management."
		},
		{
			title: "Advantages of our Platform",
			content:
				"Experience improved productivity, enhanced communication, and customizable project views for successful project execution."
		},
		{
			title: "Effective Implementation Strategies",
			content:
				"Define clear goals, provide comprehensive training, encourage adoption, and iterate based on feedback."
		}
	];
</script>

<Accordion.Root class="w-full sm:max-w-[70%]" multiple>
	{#each items as item, i}
		<Accordion.Item value="${i}" class="border-b border-dark-10 px-1.5 group">
			<Accordion.Trigger
				class="flex w-full flex-1 items-center justify-between py-5 text-[15px] font-medium [&[data-state=open]>span]:rotate-180 transition-all "
			>
				{item.title}
				<span
					class="rounded-[7px] inline-flex items-center justify-center h-8 w-8 hover:bg-dark-10 bg-transparent transition-all"
				>
					<CaretDown class="h-[18px] w-[18px] transition-all duration-200" />
				</span>
			</Accordion.Trigger>
			<Accordion.Content
				transition={slide}
				transitionConfig={{ duration: 200 }}
				class="text-sm pb-[25px]"
			>
				{item.content}
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
