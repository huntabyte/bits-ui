<script lang="ts">
  import HomeToolbar from "$lib/components/homepage/HomeToolbar.svelte";
</script>

<div class="bg-foreground rounded-card-lg py-3 px-[14px]">
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

<style lang="postcss">
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