<script lang="ts">
	import { Toolbar } from "bits-ui";
</script>

<Toolbar.Root>
	<Toolbar.Button data-testid="outer-button-1">Outer 1</Toolbar.Button>
	<Toolbar.Root>
		<Toolbar.Button data-testid="inner-button-1">Inner 1</Toolbar.Button>
		<Toolbar.Button data-testid="inner-button-2">Inner 2</Toolbar.Button>
	</Toolbar.Root>
	<Toolbar.Button data-testid="outer-button-2">Outer 2</Toolbar.Button>
</Toolbar.Root>
