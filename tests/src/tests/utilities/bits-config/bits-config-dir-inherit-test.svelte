<script lang="ts">
	import { Menubar } from "bits-ui";
</script>

<div dir="rtl">
	<Menubar.Root data-testid="menubar">
		<Menubar.Menu value="first"
			><Menubar.Trigger data-testid="first">First</Menubar.Trigger></Menubar.Menu
		>
		<Menubar.Menu value="second"
			><Menubar.Trigger data-testid="second">Second</Menubar.Trigger></Menubar.Menu
		>
	</Menubar.Root>
</div>
