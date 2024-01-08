<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "@/components/ui/button";

	$: message = $page.status === 404 ? "Not Found" : "Something went wrong";
</script>

<section
	class="flex h-[calc(100vh_-_71px_-_8rem)] flex-col items-center justify-center gap-3"
>
	<h1 class="text-6xl font-bold tracking-wider text-foreground">
		{$page.status}
	</h1>
	<p class="text-foreground">{message}</p>
	<Button size="lg" href="/docs">Back to docs</Button>
</section>
