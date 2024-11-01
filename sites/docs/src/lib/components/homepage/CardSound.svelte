<script lang="ts">
  
  import HomeToolbar from "$lib/components/homepage/HomeToolbar.svelte";
  
  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<div class="relative">
  <div class="line line_top"></div>
  <div class="line line_left"></div>
  <div class="line line_right"></div>
  <div class="bg-foreground rounded-card-lg py-3 px-[14px] m-3">
    <div class="flex justify-between">
      <h3 class="text-background text-xl font-medium ml-[6px] mt-[7px]">
        <span class="">Sound</span>
        <small class="opacity-50 block text-xs">control</small>
      </h3>
      <HomeToolbar/>
    </div>
  
    <div class="sound_meter bg-background relative">
      <div class="sound_meter__toggle bg-rose-500 w-2 h-[26px] rounded-card-sm"></div>
      <div class="sound_meter__labels">
        <div class="sound_meter__label label_left">L</div>
        <div class="sound_meter__label label_right">R</div>
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
  .line_left {
    position: absolute;
    left: 0;
    bottom: 0;
    top: -100px;
    width: 1px;
    background: linear-gradient(to top, transparent 50%, white 50%), linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
    background-size: 1px 10px, 100% 100%;
    transform: rotate(180deg);
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

  .sound_meter{
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;   
    margin-top: 17px; 
  }
  .sound_meter__toggle{
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  .sound_meter__labels{
    position: absolute;
    top: 50%;
    left: 8px;
    right: 8px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sound_meter__label{
    color: #17171766;
    display: flex;
    align-items: center;
    gap: 8px;
    &.label_left{
      &:before{
        content: "";
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        aspect-ratio: 1/1;
        background-color: #CBCBCBB2;
        
      }
    }
    &.label_right{
      &:after{
        content: "";
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        aspect-ratio: 1/1;
        background-color: #CBCBCBB2;
        
      }
    }
  }
</style>