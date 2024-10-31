<script lang="ts">
  import { Toolbar } from "bits-ui";
  import WaveSine from "phosphor-svelte/lib/WaveSine";
	import WaveSquare from "phosphor-svelte/lib/WaveSquare";
	import WaveTriangle from "phosphor-svelte/lib/WaveTriangle";
  let wave = $state(["sine"]);
</script>
 
<Toolbar.Root
  class="rounded-[7px] bg-background-alt px-[5px] py-1 w-min flex"
>
  
  <Toolbar.Group
    bind:value={wave}
    type="multiple"
    class="inline-flex items-center gap-x-0.5"
  >
    <Toolbar.GroupItem
      aria-label="wave sine"
      value="sine"
      class="inline-flex size-8 items-center justify-center rounded-[7px] bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-98 active:bg-foreground data-[state=on]:bg-foreground data-[state=on]:text-background active:data-[state=on]:bg-dark-10"
    >
      <WaveSine class="size-5" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem
      aria-label="wave square"
      value="square"
      class="inline-flex size-8 items-center justify-center rounded-[7px] bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-98 active:bg-foreground data-[state=on]:bg-foreground data-[state=on]:text-background active:data-[state=on]:bg-dark-10"
    >
      <WaveSquare class="size-5" />
    </Toolbar.GroupItem>
    <Toolbar.GroupItem
      aria-label="wave triangle"
      value="triangle"
      class="inline-flex size-8 items-center justify-center rounded-[7px] bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-98 active:bg-foreground data-[state=on]:bg-foreground data-[state=on]:text-background active:data-[state=on]:bg-dark-10"
    >
      <WaveTriangle class="size-5" />
    </Toolbar.GroupItem>
  </Toolbar.Group>
 
  
</Toolbar.Root>