<script lang="ts">
	import { Command } from "bits-ui";
	import Sticker from "phosphor-svelte/lib/Sticker";
	import CodeBlock from "phosphor-svelte/lib/CodeBlock";
	import Palette from "phosphor-svelte/lib/Palette";
	import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
	import RadioButton from "phosphor-svelte/lib/RadioButton";
	import Textbox from "phosphor-svelte/lib/Textbox";
</script>

<Command.Root
	class="divide-border border-muted bg-background flex h-full w-full flex-col divide-y self-start overflow-hidden rounded-xl border"
>
	<Command.Input
		class="focus-override h-input bg-background placeholder:text-foreground-alt/50 inline-flex w-[296px] truncate rounded-xl px-4 text-sm transition-colors focus:outline-none focus:ring-0"
		placeholder="Search for something..."
	/>
	<Command.List class="max-h-[280px] overflow-y-auto overflow-x-hidden px-2 pb-2">
		<Command.Viewport>
			<Command.Empty
				class="text-muted-foreground flex w-full items-center justify-center pb-6 pt-8 text-sm"
			>
				No results found.
			</Command.Empty>
			<Command.Group>
				<Command.GroupHeading class="text-muted-foreground px-3 pb-2 pt-4 text-xs">
					Suggestions
				</Command.GroupHeading>
				<Command.GroupItems>
					<Command.Item
						class="rounded-button data-[selected]:bg-muted flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize outline-none"
						keywords={["getting started", "tutorial"]}
					>
						<Sticker class="size-4" />
						Introduction
					</Command.Item>
					<Command.Item
						class="rounded-button data-[selected]:bg-muted flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize outline-none"
						keywords={["child", "custom element", "snippets"]}
					>
						<CodeBlock class="size-4 " />
						Delegation
					</Command.Item>
					<Command.Item
						class="rounded-button data-[selected]:bg-muted flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize outline-none"
						keywords={["css", "theme", "colors", "fonts", "tailwind"]}
					>
						<Palette class="size-4" />
						Styling
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
			<Command.Separator />
			<Command.Group>
				<Command.GroupHeading class="text-muted-foreground px-3 pb-2 pt-4 text-xs">
					Components
				</Command.GroupHeading>
				<Command.GroupItems>
					<Command.Item
						class="rounded-button data-[selected]:bg-muted flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize outline-none"
						keywords={["dates", "times"]}
					>
						<CalendarBlank class="size-4" />
						Calendar
					</Command.Item>
					<Command.Item
						class="rounded-button data-[selected]:bg-muted flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize outline-none"
						keywords={["buttons", "forms"]}
					>
						<RadioButton class="size-4" />
						Radio Group
					</Command.Item>
					<Command.Item
						class="rounded-button data-[selected]:bg-muted flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize outline-none"
						keywords={["inputs", "text", "autocomplete"]}
					>
						<Textbox class="size-4" />
						Combobox
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
		</Command.Viewport>
	</Command.List>
</Command.Root>
