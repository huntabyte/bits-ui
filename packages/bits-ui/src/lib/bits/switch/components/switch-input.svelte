<script lang="ts">
	import { getSwitchInputState } from "../switch.svelte.js";
	import { srOnlyStyles, styleToString } from "$lib/internal/style.js";

	const inputState = getSwitchInputState();
</script>

<input {...inputState.props} style={styleToString(srOnlyStyles)} />
