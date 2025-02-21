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
		class="rounded-input bg-dark text-background
	shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex
	h-12 select-none items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
	>
		Open Command Menu ⌘J
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<Dialog.Content
			class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95  data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title class="sr-only">Command Menu</Dialog.Title>
			<Dialog.Description class="sr-only">
				This is the command menu. Use the arrow keys to navigate and press ⌘K to open the
				search bar.
			</Dialog.Description>
			<Command.Root
				class="divide-border border-muted bg-background flex h-full w-full flex-col divide-y self-start overflow-hidden rounded-xl border"
			>
				<Command.Input
					class="focus-override h-input bg-background placeholder:text-foreground-alt/50 focus:outline-hidden inline-flex truncate rounded-xl px-4 text-sm transition-colors focus:ring-0"
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
							<Command.GroupHeading
								class="text-muted-foreground px-3 pb-2 pt-4 text-xs"
							>
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
						<Command.Separator />
						<Command.Group>
							<Command.GroupHeading
								class="text-muted-foreground px-3 pb-2 pt-4 text-xs"
							>
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
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
