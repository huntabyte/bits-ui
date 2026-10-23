<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	import "../../app.css";

	let open = $state(true);
	let contentId = $state("menu-content-a");
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger data-testid="trigger">open</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content data-testid="content" id={contentId}>
			<DropdownMenu.Item
				data-testid="rename"
				closeOnSelect={false}
				onSelect={() => (contentId = "menu-content-b")}
			>
				rename the content
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
