<script lang=ts>
  import X from "phosphor-svelte/lib/X";
  
  import HomeCombobox from "$lib/components/homepage/HomeCombobox.svelte";
  import HomeSwitch from "$lib/components/homepage/HomeSwitch.svelte";
  
</script>

  <div class="relative">
    <div class="line line_top"></div>
    <div class="line line_right"></div>
    <div class="m-[10px]">
      <div class="bg-white shadow-card border border-border-input rounded-card-lg py-3 px-[14px]  w-full">
        <div class="timer bg-foreground p-1 rounded-15px mb-5">
          <div class="timer_inner text-white rounded-xl px-2 pt-4 pb-9">
            <div class="time font-medium">0:00:00</div>
            <div class="text-[13px] font-medium">Task:<span class="w-[10px] aspect-square rounded-full bg-rose-500 inline-block ml-1 mr-2 mt-3"></span>New app</div>
          </div>
          <div class="labels flex gap-[3px] font-medium mt-[9px] mb-2 px-1">
            <div class="group label active px-2">design
              <X class="size-1.5 group-[.active]:block hidden relative ml-1.5" weight="bold" aria-label="Close" />
            </div>
            <div class="group label px-2">code
              <X class="size-1.5 group-[.active]:block hidden relative ml-1.5" weight="bold" aria-label="Close" />
            </div>
            <div class="group label px-2">other
              <X class="size-1.5 group-[.active]:block hidden relative ml-1.5" weight="bold" aria-label="Close" />
            </div>
          </div>
        </div>
    
        <div class="flex gap-2">
          <HomeCombobox/>
          <HomeSwitch/>
        </div>
      </div>  
    </div>
  </div>


<style lang="postcss">
  .line_top {
    position: absolute;
    top: 0;
    left: -40px;
    width: calc(100% + 50px);
    height: 1px;
    background: linear-gradient(to right, transparent 50%, white 50%), linear-gradient(to right, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
    background-size: 10px 1px, 100% 1px;
  }
  .line_right {
    position: absolute;
    right: 0;
    bottom: 0;
    top: -200px;
    width: 1px;
    background: linear-gradient(to top, transparent 50%, white 50%), linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
    background-size: 1px 10px, 100% 100%;
    transform: rotate(180deg);
  }
  .timer_inner{
    background: rgba(81,84,95,0.6);
  }
  .time{
    font-size: clamp(1.875rem, 1.7vw + 1rem, 3.125rem);
    line-height: 100%;
  }
  .label{
    display: flex;
    align-items: center;
    font-size: 11px;
    border-radius: 25px;

    background: #31343E;
    color: rgba(255,255,255,0.7);
    &.active{
      color: hsl(var(--foreground));
      background: white;
    }

  }
</style>
