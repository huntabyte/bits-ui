<script lang="ts">
	import { Command } from "bits-ui";
	import Sticker from "phosphor-svelte/lib/Sticker";
	import CodeBlock from "phosphor-svelte/lib/CodeBlock";
	import Palette from "phosphor-svelte/lib/Palette";
	import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
	import RadioButton from "phosphor-svelte/lib/RadioButton";
	import Textbox from "phosphor-svelte/lib/Textbox";
	import { onMount, onDestroy } from "svelte";

	type Emoji = {
		char: string;
		keywords: string[];
		disabled?: boolean;
	};

	type EmojiGroup = {
		name: string;
		emojis: Emoji[];
	};

	const emojiGroups: EmojiGroup[] = [
		{
			name: "Pinned",
			emojis: [
				{ char: "🤷‍♂️", keywords: ["shrug"] },
				{ char: "✅", keywords: ["check", "mark"] },
				{ char: "🎉", keywords: ["party"] },
			],
		},
		{
			name: "Frequently Used",
			emojis: [
				{ char: "¢", keywords: ["cent", "currency"] },
				{ char: "📦", keywords: ["box", "cardboard", "shipping"] },
				{ char: "🛜", keywords: ["wifi"] },
				{ char: "🔥", keywords: ["fire", "hot"] },
				{ char: "⭐", keywords: ["star", "favorite"] },
				{ char: "👍", keywords: ["thumbs up", "like", "approve"] },
				{ char: "🚀", keywords: ["rocket", "launch"] },
				{ char: "👏", keywords: ["clap", "applause"] },
			],
		},
		{
			name: "All Emojis",
			emojis: [
				{ char: "😊", keywords: ["smile", "happy", "face"] },
				{ char: "❤️", keywords: ["heart", "love"] },
				{ char: "👀", keywords: ["eyes", "look", "see"] },
				{ char: "💡", keywords: ["lightbulb", "idea"] },
				{ char: "☕", keywords: ["coffee", "drink", "break"] },
				{ char: "💻", keywords: ["computer", "laptop", "work"] },
				{ char: "✏️", keywords: ["pencil", "edit", "write"] },
				{ char: "📅", keywords: ["calendar", "date", "schedule"] },
				{ char: "📱", keywords: ["phone", "call", "mobile"] },
				{ char: "🎵", keywords: ["music", "note", "song"] },
				{ char: "📷", keywords: ["camera", "photo", "picture"] },
				{ char: "🎁", keywords: ["gift", "present", "surprise"] },
				{ char: "🌙", keywords: ["moon", "night", "sleep"] },
				{ char: "☀️", keywords: ["sun", "day", "weather"] },
				{ char: "🌈", keywords: ["rainbow", "color", "pride"] },
				{ char: "🌍", keywords: ["earth", "world", "globe"] },
				{ char: "🌳", keywords: ["tree", "nature", "plant"] },
				{ char: "🌸", keywords: ["flower", "nature", "spring"] },
				{ char: "🎆", keywords: ["fireworks", "celebration", "festival"] },
				{ char: "🎈", keywords: ["balloon", "party", "birthday"] },
				{ char: "🍪", keywords: ["cookie", "snack", "dessert"] },
				{ char: "🍕", keywords: ["pizza", "food", "slice"] },
				{ char: "🍦", keywords: ["ice cream", "dessert", "sweet"] },
				{ char: "🍎", keywords: ["apple", "fruit", "food"] },
				{ char: "🍌", keywords: ["banana", "fruit", "yellow"] },
				{ char: "🚗", keywords: ["car", "vehicle", "drive"] },
				{ char: "🚲", keywords: ["bicycle", "bike", "ride"] },
				{ char: "🚆", keywords: ["train", "travel", "transport"] },
				{ char: "✈️", keywords: ["airplane", "flight", "travel"] },
				{ char: "⚓", keywords: ["anchor", "boat", "sea"] },
				{ char: "🏅", keywords: ["medal", "award", "winner"] },
				{ char: "⚽", keywords: ["soccer", "football", "sport"] },
				{ char: "🏀", keywords: ["basketball", "sport", "game"] },
				{ char: "🏆", keywords: ["trophy", "award", "win"] },
				{ char: "📚", keywords: ["book", "read", "study"] },
				{ char: "✉️", keywords: ["mail", "envelope", "letter"] },
				{ char: "🤩", keywords: ["star eyes", "excited", "wow"] },
				{ char: "🤔", keywords: ["thinking", "hmm", "question"] },
				{ char: "😴", keywords: ["sleepy", "tired", "zzz"] },
				{ char: "😢", keywords: ["cry", "sad", "tears"] },
				{ char: "😂", keywords: ["laugh", "joy", "funny"] },
				{ char: "😉", keywords: ["wink", "flirt", "smile"] },
				{ char: "🤓", keywords: ["nerd", "geek", "glasses"] },
				{ char: "🤖", keywords: ["robot", "ai", "machine"] },
				{ char: "👻", keywords: ["ghost", "spooky", "halloween"] },
				{ char: "👽", keywords: ["alien", "space", "ufo"] },
			],
		},
	];

	let view: "list" | "emoji" = $state("list");

	function handleCommandSelect(key: string) {
		if (key === "emoji") {
			view = "emoji";
		}
	}

	function handleBackToList() {
		view = "list";
	}

	// Handle Esc key to go back to list layout when in emoji view
	function handleKeydown(event: KeyboardEvent) {
		if (view === "emoji" && event.key === "Escape") {
			event.preventDefault();
			handleBackToList();
		}
	}

	onMount(() => {
		window.addEventListener("keydown", handleKeydown);
		return () => {
			window.removeEventListener("keydown", handleKeydown);
		};
	});
</script>

<Command.Root
	columns={view === "emoji" ? 8 : undefined}
	class="divide-border border-muted bg-background flex h-full w-full flex-col divide-y self-start overflow-hidden rounded-xl border"
>
	<Command.Input
		class="focus-override h-input placeholder:text-foreground-alt/50 focus:outline-hidden bg-background inline-flex truncate rounded-tl-xl rounded-tr-xl px-4 text-sm transition-colors focus:ring-0"
		placeholder={view === "emoji" ? "Search Emoji and Symbols..." : "Search for something..."}
	/>
	{#if view === "emoji"}
		<Command.List class="max-h-[280px] overflow-y-auto overflow-x-hidden px-2 pb-2">
			<Command.Viewport>
				<div class="flex items-center gap-2 px-2 pt-2 pb-1">
					<button
						class="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
						onclick={handleBackToList}
						type="button"
					>
						← Back / Esc
					</button>
					<span class="text-xs text-muted-foreground">Emoji & Symbols</span>
				</div>
				<Command.Empty
					class="text-muted-foreground flex w-full items-center justify-center pb-6 pt-8 text-sm"
				>
					No emojis or symbols found.
				</Command.Empty>
				{#each emojiGroups as group (group)}
					<Command.Group>
						<Command.GroupHeading class="text-muted-foreground px-2 pb-2 pt-4 text-xs">
							{group.name}
						</Command.GroupHeading>
						<Command.GroupItems class="grid grid-cols-8 gap-2 px-2">
							{#each group.emojis as emoji (emoji)}
								<Command.Item
									class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
									keywords={emoji.keywords}
									disabled={emoji.disabled}
								>
									{emoji.char}
								</Command.Item>
							{/each}
						</Command.GroupItems>
					</Command.Group>
				{/each}
			</Command.Viewport>
		</Command.List>
	{:else}
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
						<Command.Item
							class="rounded-button data-selected:bg-muted outline-hidden flex h-10 cursor-pointer select-none items-center gap-2 px-3 py-2.5 text-sm capitalize"
							keywords={["emoji", "symbols", "smileys"]}
							onSelect={() => handleCommandSelect("emoji")}
						>
							<span class="size-4 flex items-center justify-center text-lg">😊</span>
							Emoji & Symbols
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
	{/if}
</Command.Root>
