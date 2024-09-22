<script lang="ts">
	import { Command } from "bits-ui";
	import {
		ContactIcon,
		DocsIcon,
		FeedbackIcon,
		PlusIcon,
		ProjectsIcon,
		TeamsIcon,
	} from "./icons/index.js";
	import Item from "./item.svelte";

	let { searchProjects }: { searchProjects: () => void } = $props();
</script>

<Command.Group>
	<Command.GroupHeading>Projects</Command.GroupHeading>
	<Command.GroupItems>
		<Item shortcut="S P" onSelect={searchProjects}>
			<ProjectsIcon />
			Search Projects...
		</Item>
		<Item>
			<PlusIcon />
			Create New Project...
		</Item>
	</Command.GroupItems>
</Command.Group>
<Command.Group>
	<Command.GroupHeading>Teams</Command.GroupHeading>
	<Command.GroupItems>
		<Item shortcut="⇧ P">
			<TeamsIcon />
			Search Teams...
		</Item>
		<Item>
			<PlusIcon />
			Create New Team...
		</Item>
	</Command.GroupItems>
</Command.Group>
<Command.Group>
	<Command.GroupHeading>Help</Command.GroupHeading>
	<Command.GroupItems>
		<Item shortcut="⇧ D">
			<DocsIcon />
			Search Docs...
		</Item>
		<Item>
			<FeedbackIcon />
			Send Feedback...
		</Item>
		<Item>
			<ContactIcon />
			Contact Support
		</Item>
	</Command.GroupItems>
</Command.Group>
