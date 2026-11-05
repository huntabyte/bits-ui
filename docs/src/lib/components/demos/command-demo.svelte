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
	class="flex h-full w-full flex-col divide-y divide-border self-start overflow-hidden rounded-xl border border-muted bg-background"
>
	<Command.Input
		class="focus-override inline-flex h-input truncate rounded-tl-xl rounded-tr-xl bg-background px-4 text-sm transition-colors placeholder:text-foreground-alt/50 focus:ring-0 focus:outline-hidden"
		placeholder="Search for something..."
	/>
	<Command.List class="max-h-[280px] overflow-x-hidden overflow-y-auto px-2 pb-2">
		<Command.Viewport>
			<Command.Empty
				class="flex w-full items-center justify-center pt-8 pb-6 text-sm text-muted-foreground"
			>
				No results found.
			</Command.Empty>
			<Command.Group>
				<Command.GroupHeading class="px-3 pt-4 pb-2 text-xs text-muted-foreground">
					Suggestions
				</Command.GroupHeading>
				<Command.GroupItems>
					<Command.Item
						class="flex h-10 cursor-pointer items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-hidden select-none data-selected:bg-muted"
						keywords={["getting started", "tutorial"]}
					>
						<Sticker class="size-4" />
						Introduction
					</Command.Item>
					<Command.Item
						class="flex h-10 cursor-pointer items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-hidden select-none data-selected:bg-muted"
						keywords={["child", "custom element", "snippets"]}
					>
						<CodeBlock class="size-4 " />
						Delegation
					</Command.Item>
					<Command.Item
						class="flex h-10 cursor-pointer items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-hidden select-none data-selected:bg-muted"
						keywords={["css", "theme", "colors", "fonts", "tailwind"]}
					>
						<Palette class="size-4" />
						Styling
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
			<Command.Separator class="h-px w-full bg-foreground/5" />
			<Command.Group>
				<Command.GroupHeading class="px-3 pt-4 pb-2 text-xs text-muted-foreground">
					Components
				</Command.GroupHeading>
				<Command.GroupItems>
					<Command.Item
						class="flex h-10 cursor-pointer items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-hidden select-none data-selected:bg-muted"
						keywords={["dates", "times"]}
					>
						<CalendarBlank class="size-4" />
						Calendar
					</Command.Item>
					<Command.Item
						class="flex h-10 cursor-pointer items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-hidden select-none data-selected:bg-muted"
						keywords={["buttons", "forms"]}
					>
						<RadioButton class="size-4" />
						Radio Group
					</Command.Item>
					<Command.Item
						class="flex h-10 cursor-pointer items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-hidden select-none data-selected:bg-muted"
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
