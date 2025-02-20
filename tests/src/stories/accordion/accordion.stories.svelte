<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import Accordion from "./accordion.svelte";

	const items = [
		{
			value: "1",
			title: "What is the meaning of life?",
			content:
				"To become a better person, to help others, and to leave the world a better place than you found it.",
		},
		{
			value: "2",
			title: "How do I become a better person?",
			content:
				"Read books, listen to podcasts, and surround yourself with people who inspire you.",
		},
		{
			value: "3",
			title: "What is the best way to help others?",
			content: "Give them your time, attention, and love.",
		},
	];

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: "Example/Accordion",
		component: Accordion,
		argTypes: {
			type: {
				control: { type: "select" },
				options: ["single", "multiple"],
			},
		},
		args: {
			type: "single",
			items,
		},
	});
</script>

<Story name="Single" args={{ type: "single" }} />
<Story name="Multiple" args={{ type: "multiple" }} />
<Story
	name="Disabled Items"
	args={{
		type: "multiple",
		items: items.map((i) => {
			if (i.value === "2") {
				return { ...i, disabled: true };
			}
			return i;
		}),
	}}
/>
