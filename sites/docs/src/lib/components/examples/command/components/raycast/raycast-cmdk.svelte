<script lang="ts">
	import { mode } from "mode-watcher";
	import "./raycast.postcss";
	import { Command } from "bits-ui";
	import { FigmaIcon, LinearIcon, RaycastIcon, SlackIcon, YouTubeIcon } from "../icons/index.js";
	import Logo from "../logo.svelte";
	import Item from "./item.svelte";
	import { ClipboardIcon, HammerIcon, RaycastDarkIcon, RaycastLightIcon } from "./icons/index.js";
	import SubCommand from "./sub-command.svelte";

	let value = $state("linear");
	let inputEl = $state<HTMLInputElement | null>(null);
	let listEl = $state<HTMLElement | null>(null);
</script>

<div class="raycast">
	<Command.Root bind:value>
		<div data-command-raycast-top-shine=""></div>
		<Command.Input autofocus placeholder="Search for apps and commands..." bind:ref={inputEl} />
		<hr data-command-raycast-loader="" />
		<Command.List bind:ref={listEl}>
			<Command.ListViewport>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group>
					<Command.GroupHeading>Suggestions</Command.GroupHeading>
					<Command.GroupItems>
						<Item value="linear">
							<Logo>
								<LinearIcon style="width: 12px; height: 12px" />
							</Logo>
							Linear
						</Item>
						<Item value="figma">
							<Logo>
								<FigmaIcon />
							</Logo>
							Figma
						</Item>
						<Item value="slack">
							<Logo>
								<SlackIcon />
							</Logo>
							Slack
						</Item>
						<Item value="youtube">
							<Logo>
								<YouTubeIcon />
							</Logo>
							YouTube
						</Item>
						<Item value="raycast">
							<Logo>
								<RaycastIcon />
							</Logo>
							Raycast
						</Item>
					</Command.GroupItems>
				</Command.Group>
				<Command.Group>
					<Command.GroupHeading>Commands</Command.GroupHeading>
					<Command.GroupItems>
						<Item isCommand value="clipboard history">
							<Logo>
								<ClipboardIcon />
							</Logo>
							Clipboard History
						</Item>
						<Item isCommand value="import extension">
							<Logo>
								<HammerIcon />
							</Logo>
							Import Extension
						</Item>
						<Item isCommand value="manage extensions">
							<Logo>
								<HammerIcon />
							</Logo>
							Manage Extensions
						</Item>
					</Command.GroupItems>
				</Command.Group>
			</Command.ListViewport>
		</Command.List>

		<div data-command-raycast-footer="">
			{#if $mode === "dark"}
				<RaycastDarkIcon />
			{:else}
				<RaycastLightIcon />
			{/if}
			<button data-command-raycast-open-trigger="">
				Open Application
				<kbd>↵</kbd>
			</button>

			<hr />

			<SubCommand {listEl} {inputEl} selectedValue={value} />
		</div>
	</Command.Root>
</div>
