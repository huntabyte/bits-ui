<script lang="ts">
	import { Command } from "bits-ui";
</script>

<Command.Root
	columns={8}
	class="divide-border border-muted bg-background flex h-full w-full flex-col divide-y self-start overflow-hidden rounded-xl border"
>
	<Command.Input
		class="focus-override h-input placeholder:text-foreground-alt/50 focus:outline-hidden bg-background inline-flex truncate rounded-tl-xl rounded-tr-xl px-4 text-sm transition-colors focus:ring-0"
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
				<Command.GroupHeading class="text-muted-foreground px-2 pb-2 pt-4 text-xs">
					Pinned
				</Command.GroupHeading>
				<Command.GroupItems class="grid grid-cols-8 gap-2 px-2">
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["shrug"]}
					>
						🤷‍♂️
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["check", "mark"]}
					>
						✅
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["party"]}
					>
						🎉
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
			<Command.Group>
				<Command.GroupHeading class="text-muted-foreground px-2 pb-2 pt-4 text-xs">
					Frequently Used
				</Command.GroupHeading>
				<Command.GroupItems class="grid grid-cols-8 gap-2 px-2">
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["cent", "currency"]}
					>
						¢
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["box", "cardboard", "shipping"]}
					>
						📦
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["wifi"]}
					>
						🛜
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["fire", "hot"]}
					>
						🔥
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["star", "favorite"]}
					>
						⭐
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["thumbs up", "like", "approve"]}
					>
						👍
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["rocket", "launch"]}
					>
						🚀
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["clap", "applause"]}
					>
						👏
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
			<Command.Group>
				<Command.GroupHeading class="text-muted-foreground px-2 pb-2 pt-4 text-xs">
					All Emojis
				</Command.GroupHeading>
				<Command.GroupItems class="grid grid-cols-8 gap-2 px-2">
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["smile", "happy", "face"]}
					>
						😊
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["heart", "love"]}
					>
						❤️
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["eyes", "look", "see"]}
					>
						👀
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["lightbulb", "idea"]}
					>
						💡
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["coffee", "drink", "break"]}
					>
						☕
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["computer", "laptop", "work"]}
					>
						💻
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["pencil", "edit", "write"]}
					>
						✏️
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["calendar", "date", "schedule"]}
					>
						📅
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["phone", "call", "mobile"]}
					>
						📱
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["music", "note", "song"]}
					>
						🎵
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["camera", "photo", "picture"]}
					>
						📷
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["gift", "present", "surprise"]}
					>
						🎁
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["moon", "night", "sleep"]}
					>
						🌙
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["sun", "day", "weather"]}
					>
						☀️
					</Command.Item>
					<!-- More rows below -->
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["rainbow", "color", "pride"]}
					>
						🌈
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["earth", "world", "globe"]}
					>
						🌍
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["tree", "nature", "plant"]}
					>
						🌳
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["flower", "nature", "spring"]}
					>
						🌸
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["fireworks", "celebration", "festival"]}
					>
						🎆
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["balloon", "party", "birthday"]}
					>
						🎈
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["cookie", "snack", "dessert"]}
					>
						🍪
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["pizza", "food", "slice"]}
					>
						🍕
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["ice cream", "dessert", "sweet"]}
					>
						🍦
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["apple", "fruit", "food"]}
					>
						🍎
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["banana", "fruit", "yellow"]}
					>
						🍌
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["car", "vehicle", "drive"]}
					>
						🚗
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["bicycle", "bike", "ride"]}
					>
						🚲
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["train", "travel", "transport"]}
					>
						🚆
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["airplane", "flight", "travel"]}
					>
						✈️
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["anchor", "boat", "sea"]}
					>
						⚓
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["medal", "award", "winner"]}
					>
						🏅
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["soccer", "football", "sport"]}
					>
						⚽
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["basketball", "sport", "game"]}
					>
						🏀
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["trophy", "award", "win"]}
					>
						🏆
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["book", "read", "study"]}
					>
						📚
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["mail", "envelope", "letter"]}
					>
						✉️
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["star eyes", "excited", "wow"]}
					>
						🤩
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["thinking", "hmm", "question"]}
					>
						🤔
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["sleepy", "tired", "zzz"]}
					>
						😴
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["cry", "sad", "tears"]}
					>
						😢
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["laugh", "joy", "funny"]}
					>
						😂
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["wink", "flirt", "smile"]}
					>
						😉
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["nerd", "geek", "glasses"]}
					>
						🤓
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["robot", "ai", "machine"]}
					>
						🤖
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["ghost", "spooky", "halloween"]}
					>
						👻
					</Command.Item>
					<Command.Item
						class="rounded-button bg-muted data-selected:ring-foreground outline-hidden flex aspect-square size-full cursor-pointer select-none items-center justify-center text-2xl ring-2 ring-transparent"
						keywords={["alien", "space", "ufo"]}
					>
						👽
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
		</Command.Viewport>
	</Command.List>
</Command.Root>
