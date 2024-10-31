<script lang="ts">
  import Fan from "phosphor-svelte/lib/Fan";
  import { Tabs } from "bits-ui";
  import HomeSlider from "$lib/components/homepage/HomeSlider.svelte";
</script>

<div class="bg-[#e0f2fe] rounded-card-lg pt-5 px-5 pb-8 h-min">
  <div class="flex justify-between">
    <Tabs.Root value="c" class="flex items-center font-medium">
      <Tabs.Content value="c" class="select-none"><span class="temp text-indigo-950">21</span></Tabs.Content>
      <Tabs.Content value="f" class="select-none"><span class="temp text-indigo-950">69.8</span></Tabs.Content>

      <Tabs.List class="flex flex-col text-[14px] gap-2 ml-1">
        <Tabs.Trigger value="c" class="text-indigo-950/30 data-[state=active]:text-indigo-950">°C</Tabs.Trigger>
        <Tabs.Trigger value="f" class="text-indigo-950/30 data-[state=active]:text-indigo-950">°F</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>

    <div class="text-right text-indigo-950 font-semibold">
      <Fan class="size-6 ml-auto"/>
      <div class="right_text">Air<br>Conditioner</div>
    </div>

  </div>

  <div class="flex justify-between my-5 relative">
    
    {#each { length: 7} as i, _}
    <div class="outer w-4 h-16 rounded-[35px] relative bg-[#000231]/10">
      <div class="inner w-full h-1/2 rounded-[35px] absolute bottom-0 bg-indigo-950"></div>
    </div>
    {/each}
    <div class="sine">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 30" fill="none" class="">
        <path d="M1 29C10.3489 20.1254 38.5826 2.10999 76.7262 1.04504C124.406 -0.286151 145.441 28.3343 170.332 28.3344C192.075 28.3345 205.975 13.5804 211 7.36823" stroke="#F43F5E" stroke-width="2"/>
      </svg>
    </div>
  </div>

  <HomeSlider/>
</div>

<style lang="postcss">
  .temp{
    font-size: clamp(3.125rem, 3.6vw + 1rem, 5rem);
    line-height: 1;
  }
  .right_text{
    letter-spacing: -0.01em;
    font-size: 10px;
    line-height: 110%;
    margin-top: 0.6em;
  }
  .sine{
    position: absolute;
    top: 50%;
    left: -6px;
    transform: translateY(-50%);
    width: calc(100% + 10px); 
    aspect-ratio: 212/30;
    svg{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
</style>
