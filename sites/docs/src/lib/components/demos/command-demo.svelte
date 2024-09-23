<script lang="ts">
	import { Command } from "bits-ui";
</script>

<Command.Root
	class="flex h-full w-full flex-col self-start overflow-hidden rounded-xl border border-muted bg-background"
>
	<Command.Input
		class="focus-override inline-flex h-input w-[296px] truncate rounded-xl bg-background px-4 text-sm transition-colors placeholder:text-foreground-alt/50 focus:outline-none focus:ring-0"
	/>
	<Command.List class="max-h-[300px] overflow-y-auto overflow-x-hidden px-2">
		<Command.ListViewport>
			<Command.Empty>No results found.</Command.Empty>
			<Command.Group>
				<Command.GroupHeading class="mt-2 text-sm text-muted-foreground">
					Suggestions
				</Command.GroupHeading>
				<Command.GroupItems>
					<Command.Item
						class="mt-2 flex h-10 select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none data-[selected]:bg-muted"
					>
						Calendar
					</Command.Item>
					<Command.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none data-[selected]:bg-muted"
					>
						Search Emoji
					</Command.Item>
					<Command.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none data-[selected]:bg-muted"
					>
						Calculator
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
			<Command.Separator />
			<Command.Group>
				<Command.GroupHeading>Settings</Command.GroupHeading>
				<Command.GroupItems>
					<Command.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none data-[selected]:bg-muted"
					>
						Notifications
					</Command.Item>
					<Command.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none data-[selected]:bg-muted"
					>
						Account
					</Command.Item>
					<Command.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none data-[selected]:bg-muted"
					>
						Privacy
					</Command.Item>
					<Command.Item
						class="flex h-10 select-none items-center rounded-button py-3 pl-5 pr-1.5 text-sm capitalize outline-none data-[selected]:bg-muted"
					>
						Help
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
		</Command.ListViewport>
	</Command.List>
</Command.Root>
