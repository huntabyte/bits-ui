<script lang="ts">
	import { Command } from "bits-ui";
	import Sticker from "phosphor-svelte/lib/Sticker";
	import Smiley from "phosphor-svelte/lib/Smiley";
	import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
	import { Button } from "../ui/button/index.js";
	import { cn } from "#lib/utils/index.js";

	type Item = {
		icon?: typeof Sticker;
		content: string;
		keywords: string[];
		disabled?: boolean;
		action?: () => void;
	};

	type Group = {
		name: string;
		items: Item[];
	};

	type View = {
		columns: number | undefined;
		empty: string;
		placeholder: string;
		groups: Group[];
	};

	const defaultView: View = {
		columns: undefined,
		placeholder: "Search for something...",
		empty: "No results found.",
		groups: [
			{
				name: "Suggestions",
				items: [
					{
						content: "Search Emojis and Symbols",
						keywords: ["emoji", "symbols"],
						icon: Smiley,
						action: () => {
							search = "";
							views.push(emojiView);
						},
					},
				],
			},
		],
	};

	const emojiView: View = {
		columns: 8,
		placeholder: "Search Emoji and Symbols...",
		empty: "No emojis or symbols found.",
		groups: [
			{
				name: "Pinned",
				items: [
					{ content: "🤷‍♂️", keywords: ["shrug"] },
					{ content: "✅", keywords: ["check", "mark"] },
					{ content: "🎉", keywords: ["party"] },
				],
			},
			{
				name: "Frequently Used",
				items: [
					{ content: "¢", keywords: ["cent", "currency"] },
					{ content: "📦", keywords: ["box", "cardboard", "shipping"] },
					{ content: "🛜", keywords: ["wifi"] },
					{ content: "🔥", keywords: ["fire", "hot"] },
					{ content: "⭐", keywords: ["star", "favorite"] },
					{ content: "👍", keywords: ["thumbs up", "like", "approve"] },
					{ content: "🚀", keywords: ["rocket", "launch"] },
					{ content: "👏", keywords: ["clap", "applause"] },
				],
			},
			{
				name: "All Emojis",
				items: [
					{ content: "😊", keywords: ["smile", "happy", "face"] },
					{ content: "❤️", keywords: ["heart", "love"] },
					{ content: "👀", keywords: ["eyes", "look", "see"] },
					{ content: "💡", keywords: ["lightbulb", "idea"] },
					{ content: "☕", keywords: ["coffee", "drink", "break"] },
					{ content: "💻", keywords: ["computer", "laptop", "work"] },
					{ content: "✏️", keywords: ["pencil", "edit", "write"] },
					{ content: "📅", keywords: ["calendar", "date", "schedule"] },
					{ content: "📱", keywords: ["phone", "call", "mobile"] },
					{ content: "🎵", keywords: ["music", "note", "song"] },
					{ content: "📷", keywords: ["camera", "photo", "picture"] },
					{ content: "🎁", keywords: ["gift", "present", "surprise"] },
					{ content: "🌙", keywords: ["moon", "night", "sleep"] },
					{ content: "☀️", keywords: ["sun", "day", "weather"] },
					{ content: "🌈", keywords: ["rainbow", "color", "pride"] },
					{ content: "🌍", keywords: ["earth", "world", "globe"] },
					{ content: "🌳", keywords: ["tree", "nature", "plant"] },
					{ content: "🌸", keywords: ["flower", "nature", "spring"] },
					{ content: "🎆", keywords: ["fireworks", "celebration", "festival"] },
					{ content: "🎈", keywords: ["balloon", "party", "birthday"] },
					{ content: "🍪", keywords: ["cookie", "snack", "dessert"] },
					{ content: "🍕", keywords: ["pizza", "food", "slice"] },
					{ content: "🍦", keywords: ["ice cream", "dessert", "sweet"] },
					{ content: "🍎", keywords: ["apple", "fruit", "food"] },
					{ content: "🍌", keywords: ["banana", "fruit", "yellow"] },
					{ content: "🚗", keywords: ["car", "vehicle", "drive"] },
					{ content: "🚲", keywords: ["bicycle", "bike", "ride"] },
					{ content: "🚆", keywords: ["train", "travel", "transport"] },
					{ content: "✈️", keywords: ["airplane", "flight", "travel"] },
					{ content: "⚓", keywords: ["anchor", "boat", "sea"] },
					{ content: "🏅", keywords: ["medal", "award", "winner"] },
					{ content: "⚽", keywords: ["soccer", "football", "sport"] },
					{ content: "🏀", keywords: ["basketball", "sport", "game"] },
					{ content: "🏆", keywords: ["trophy", "award", "win"] },
					{ content: "📚", keywords: ["book", "read", "study"] },
					{ content: "✉️", keywords: ["mail", "envelope", "letter"] },
					{ content: "🤩", keywords: ["star eyes", "excited", "wow"] },
					{ content: "🤔", keywords: ["thinking", "hmm", "question"] },
					{ content: "😴", keywords: ["sleepy", "tired", "zzz"] },
					{ content: "😢", keywords: ["cry", "sad", "tears"] },
					{ content: "😂", keywords: ["laugh", "joy", "funny"] },
					{ content: "😉", keywords: ["wink", "flirt", "smile"] },
					{ content: "🤓", keywords: ["nerd", "geek", "glasses"] },
					{ content: "🤖", keywords: ["robot", "ai", "machine"] },
					{ content: "👻", keywords: ["ghost", "spooky", "halloween"] },
					{ content: "👽", keywords: ["alien", "space", "ufo"] },
				],
			},
		],
	};

	const views: View[] = $state([defaultView, emojiView]);

	const currentView = $derived(views[views.length - 1]);

	let search = $state("");

	function popView() {
		if (views.length > 1) {
			views.pop();
		}
	}
</script>

<Command.Root
	disableInitialScroll={true}
	columns={currentView.columns}
	class="flex h-full w-full flex-col divide-y divide-border self-start overflow-hidden rounded-xl border border-muted bg-background"
>
	<div class="flex items-center">
		{#if views.length > 1}
			<Button variant="ghost" onclick={() => views.pop()}>
				<ArrowLeft />
			</Button>
		{/if}
		<Command.Input
			autofocus={false}
			class={cn(
				"focus-override inline-flex h-input flex-1 truncate rounded-tl-xl rounded-tr-xl bg-background pr-4 text-sm transition-colors placeholder:text-foreground-alt/50 focus:ring-0 focus:outline-hidden",
				{ "pl-4": views.length === 1 }
			)}
			bind:value={search}
			onkeydown={(e) => {
				if (e.key === "Backspace" && search.length === 0) {
					e.preventDefault();
					popView();
				}
			}}
			placeholder={currentView.placeholder}
		/>
	</div>
	{#if currentView.columns !== undefined}
		<Command.List class="max-h-[280px] overflow-x-hidden overflow-y-auto px-2 pb-2">
			<Command.Viewport>
				<Command.Empty
					class="flex w-full items-center justify-center pt-8 pb-6 text-sm text-muted-foreground"
				>
					{currentView.empty}
				</Command.Empty>
				{#each currentView.groups as group (group)}
					<Command.Group>
						<Command.GroupHeading class="px-2 pt-4 pb-2 text-xs text-muted-foreground">
							{group.name}
						</Command.GroupHeading>
						<Command.GroupItems class="grid grid-cols-8 gap-2 px-2">
							{#each group.items as groupItem (groupItem)}
								<Command.Item
									class="flex aspect-square size-full cursor-pointer items-center justify-center rounded-button bg-muted text-2xl ring-2 ring-transparent outline-hidden select-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-selected:ring-foreground"
									keywords={groupItem.keywords}
									disabled={groupItem.disabled}
								>
									{#if groupItem.icon}
										<groupItem.icon class="size-4" />
									{:else}
										{groupItem.content}
									{/if}
								</Command.Item>
							{/each}
						</Command.GroupItems>
					</Command.Group>
				{/each}
			</Command.Viewport>
		</Command.List>
	{:else}
		<Command.List class="max-h-[280px] overflow-x-hidden overflow-y-auto px-2 pb-2">
			<Command.Viewport>
				<Command.Empty
					class="flex w-full items-center justify-center pt-8 pb-6 text-sm text-muted-foreground"
				>
					{currentView.empty}
				</Command.Empty>
				{#each currentView.groups as group (group)}
					<Command.Group>
						<Command.GroupHeading class="px-3 pt-4 pb-2 text-xs text-muted-foreground">
							{group.name}
						</Command.GroupHeading>
						<Command.GroupItems>
							{#each group.items as groupItem (groupItem)}
								<Command.Item
									class="flex h-10 cursor-pointer items-center gap-2 rounded-button px-3 py-2.5 text-sm capitalize outline-hidden select-none data-selected:bg-muted"
									keywords={groupItem.keywords}
									disabled={groupItem.disabled}
									onSelect={groupItem.action}
								>
									{#if groupItem.icon}
										<groupItem.icon class="size-4" />
									{/if}
									{groupItem.content}
								</Command.Item>
							{/each}
						</Command.GroupItems>
					</Command.Group>
				{/each}
			</Command.Viewport>
		</Command.List>
	{/if}
</Command.Root>
