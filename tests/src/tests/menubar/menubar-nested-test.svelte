<script lang="ts">
	import { Menubar } from "bits-ui";
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger data-testid="outer-trigger-1">Outer 1</Menubar.Trigger>
	</Menubar.Menu>
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger data-testid="inner-trigger-1">Inner 1</Menubar.Trigger>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger data-testid="inner-trigger-2">Inner 2</Menubar.Trigger>
		</Menubar.Menu>
	</Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger data-testid="outer-trigger-2">Outer 2</Menubar.Trigger>
	</Menubar.Menu>
</Menubar.Root>
