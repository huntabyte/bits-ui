<script lang="ts">
	import * as Checkbox from "@/components/ui/checkbox";
	import * as Label from "@/components/ui/label";
</script>

<div>
	<div class="flex items-center space-x-2">
		<Checkbox.Root id="terms" />
		<Label.Root for="terms">Accept terms and conditions</Label.Root>
	</div>
</div>
