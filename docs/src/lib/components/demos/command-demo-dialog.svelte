<script lang="ts">
	import { Command, Dialog } from "bits-ui";
	import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
	import CodeBlock from "phosphor-svelte/lib/CodeBlock";
	import Palette from "phosphor-svelte/lib/Palette";
	import RadioButton from "phosphor-svelte/lib/RadioButton";
	import Sticker from "phosphor-svelte/lib/Sticker";
	import Textbox from "phosphor-svelte/lib/Textbox";

	let dialogOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			dialogOpen = true;
		}
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger
		class="inline-flex h-12 items-center
	justify-center rounded-input bg-dark px-[21px] text-[15px] font-semibold
	whitespace-nowrap text-background shadow-mini transition-colors select-none hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
	>
		Open Command Menu ⌘J
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed top-[50%] left-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg  bg-background shadow-popover outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title class="sr-only">Command Menu</Dialog.Title>
			<Dialog.Description class="sr-only">
				This is the command menu. Use the arrow keys to navigate and press ⌘K to open the
				search bar.
			</Dialog.Description>
			<Command.Root
				class="flex h-full w-full flex-col divide-y divide-border self-start overflow-hidden rounded-xl border border-muted bg-background"
			>
				<Command.Input
					class="focus-override inline-flex h-input truncate rounded-xl bg-background px-4 text-sm transition-colors placeholder:text-foreground-alt/50 focus:ring-0 focus:outline-hidden"
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
							<Command.GroupHeading
								class="px-3 pt-4 pb-2 text-xs text-muted-foreground"
							>
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
						<Command.Separator />
						<Command.Group>
							<Command.GroupHeading
								class="px-3 pt-4 pb-2 text-xs text-muted-foreground"
							>
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
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
