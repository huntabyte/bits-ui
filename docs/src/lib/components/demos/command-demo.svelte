<script lang="ts">
	import { Command } from "bits-ui";
	import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
	import CodeBlock from "phosphor-svelte/lib/CodeBlock";
	import Palette from "phosphor-svelte/lib/Palette";
	import RadioButton from "phosphor-svelte/lib/RadioButton";
	import Sticker from "phosphor-svelte/lib/Sticker";
	import Textbox from "phosphor-svelte/lib/Textbox";
</script>

<Command.Root
	class="divide-border border-muted bg-background flex h-full w-full flex-col divide-y self-start overflow-hidden rounded-xl border"
>
	<Command.Input
		class="focus-override h-input placeholder:text-foreground-alt/50 bg-background focus:outline-hidden inline-flex truncate rounded-tl-xl rounded-tr-xl px-4 text-sm transition-colors focus:ring-0"
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
						class="rounded-button data-selected:bg-muted outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize"
						keywords={["getting started", "tutorial"]}
					>
						<Sticker class="size-4" />
						Introduction
					</Command.Item>
					<Command.Item
						class="rounded-button data-selected:bg-muted outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize"
						keywords={["child", "custom element", "snippets"]}
					>
						<CodeBlock class="size-4 " />
						Delegation
					</Command.Item>
					<Command.Item
						class="rounded-button data-selected:bg-muted outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize"
						keywords={["css", "theme", "colors", "fonts", "tailwind"]}
					>
						<Palette class="size-4" />
						Styling
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
			<Command.Separator class="bg-foreground/5 h-px w-full" />
			<Command.Group>
				<Command.GroupHeading class="text-muted-foreground px-3 pb-2 pt-4 text-xs">
					Components
				</Command.GroupHeading>
				<Command.GroupItems>
					<Command.Item
						class="rounded-button data-selected:bg-muted outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize"
						keywords={["dates", "times"]}
					>
						<CalendarBlank class="size-4" />
						Calendar
					</Command.Item>
					<Command.Item
						class="rounded-button data-selected:bg-muted outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize"
						keywords={["buttons", "forms"]}
					>
						<RadioButton class="size-4" />
						Radio Group
					</Command.Item>
					<Command.Item
						class="rounded-button data-selected:bg-muted outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize"
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
