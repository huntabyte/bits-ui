<script lang="ts">
	import { Sidebar } from "bits-ui";

	const sidebar = Sidebar.useSidebar();
</script>

<span data-testid="context-state">{sidebar.state}</span>
<button data-testid="context-trigger" onclick={sidebar.toggle}>Context toggle</button>
