<script lang=ts>
  import { Avatar, DropdownMenu, Tabs } from "bits-ui";
  let loadingStatus = $state<Avatar.RootProps["loadingStatus"]>("loading");
  import Cardholder from "phosphor-svelte/lib/Cardholder";
  import DotsThreeVertical from "phosphor-svelte/lib/DotsThreeVertical";
  import UserCircle from "phosphor-svelte/lib/UserCircle";
 
</script>

<div class="outer relative flex">
  <div class="circle border border-border-input bg-white w-3 aspect-square rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 "/>
  <div class="circle border border-border-input bg-white w-3 aspect-square rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 "/>
  <div class="middle border border-border-input bg-white w-6 aspect-[24/6] rounded-[7px] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 "/>
  <div class="middle border border-border-input bg-white w-6 aspect-[24/6] rounded-[7px] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 "/>
  <div class="circle border border-border-input bg-white w-3 aspect-square rounded-full absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 "/>
  <div class="circle border border-border-input bg-white w-3 aspect-square rounded-full absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 "/>
  
  <div class="bg-[#FEFCE8] rounded-card-lg py-3 px-[14px] m-[10px] w-full">
    <Tabs.Root value="follow">
      <Tabs.List class="bg-[#18181B12] h-10 flex items-center px-[3px] py-1 rounded-input shadow-mini-inset mb-[14px]">
        <Tabs.Trigger value="follow" class="data-[state=active]:bg-white data-[state=active]:shadow-mini rounded-[7px] text-sm font-medium h-8 w-full text-foreground/70 data-[state=active]:text-foreground">Follow</Tabs.Trigger>
        <Tabs.Trigger value="other" class="data-[state=active]:bg-white data-[state=active]:shadow-mini rounded-[7px] text-sm font-medium h-8 w-full text-foreground/70 data-[state=active]:text-foreground">Other</Tabs.Trigger>
      </Tabs.List>
    
      <Tabs.Content value="follow" class="select-none ">
        
        <div class="flex items-center justify-between mb-3">
          <div class=" flex">
            <Avatar.Root
              bind:loadingStatus
              class="h-10 w-10 rounded-full border {loadingStatus === 'loaded'
                ? 'border-foreground'
                : 'border-transparent'} bg-muted text-[17px] font-medium uppercase text-muted-foreground"
            >
              <div
                class="flex h-full w-full items-center justify-center overflow-hidden rounded-full"
              >
                <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
                <Avatar.Fallback class="border border-muted">HB</Avatar.Fallback>
              </div>
            </Avatar.Root>
      
            <div class="name ml-2">
              <h3 class="text-foreground font-medium text-sm">Hunter</h3>
              <p class="text-muted-foreground text-[12px] font-medium">@huntabyte</p>
            </div>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              class="focus-visible border-border-input bg-white text-a-foreground inline-flex h-8 w-8 select-none items-center justify-center rounded-[7px] border text-sm font-medium shadow-mini hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
            >
              <DotsThreeVertical class="size-5 text-foreground " />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                class="focus-override w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none focus-visible:outline-none"
                sideOffset={8}
              >
                <DropdownMenu.Item
                  class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
                >
                  <div class="flex items-center">
                    <UserCircle class="mr-2 size-5 text-foreground-alt" />
                    Profile
                  </div>
                  <div class="ml-auto flex items-center gap-px">
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
                    >
                      ⌘
                    </kbd>
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
                    >
                      P
                    </kbd>
                  </div>
                </DropdownMenu.Item>
    
                <DropdownMenu.Item
                  class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
                >
                  <div class="flex items-center">
                    <Cardholder class="mr-2 size-5 text-foreground-alt" />
                    Billing
                  </div>
                  <div class="ml-auto flex items-center gap-px">
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
                    >
                      ⌘
                    </kbd>
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
                    >
                      B
                    </kbd>
                  </div>
                </DropdownMenu.Item>
                
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
  
        <div class="flex items-center justify-between mb-3">
          <div class=" flex">
            <Avatar.Root
              bind:loadingStatus
              class="h-10 w-10 rounded-full border {loadingStatus === 'loaded'
                ? 'border-foreground'
                : 'border-transparent'} bg-muted text-[17px] font-medium uppercase text-muted-foreground"
            >
              <div
                class="flex h-full w-full items-center justify-center overflow-hidden rounded-full"
              >
                <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
                <Avatar.Fallback class="border border-muted">HB</Avatar.Fallback>
              </div>
            </Avatar.Root>
      
            <div class="name ml-2">
              <h3 class="text-foreground font-medium text-sm">Pavel</h3>
              <p class="text-muted-foreground text-[12px] font-medium">@pavelstianko</p>
            </div>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              class="focus-visible border-border-input bg-white text-a-foreground inline-flex h-8 w-8 select-none items-center justify-center rounded-[7px] border text-sm font-medium shadow-mini hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
            >
              <DotsThreeVertical class="size-5 text-foreground " />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                class="focus-override w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none focus-visible:outline-none"
                sideOffset={8}
              >
                <DropdownMenu.Item
                  class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
                >
                  <div class="flex items-center">
                    <UserCircle class="mr-2 size-5 text-foreground-alt" />
                    Profile
                  </div>
                  <div class="ml-auto flex items-center gap-px">
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
                    >
                      ⌘
                    </kbd>
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
                    >
                      P
                    </kbd>
                  </div>
                </DropdownMenu.Item>
    
                <DropdownMenu.Item
                  class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
                >
                  <div class="flex items-center">
                    <Cardholder class="mr-2 size-5 text-foreground-alt" />
                    Billing
                  </div>
                  <div class="ml-auto flex items-center gap-px">
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
                    >
                      ⌘
                    </kbd>
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
                    >
                      B
                    </kbd>
                  </div>
                </DropdownMenu.Item>
                
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      
      </Tabs.Content>
      <Tabs.Content value="other" class="select-none">
        <div class="flex items-center justify-between mb-3">
          <div class=" flex">
            <Avatar.Root
              bind:loadingStatus
              class="h-10 w-10 rounded-full border {loadingStatus === 'loaded'
                ? 'border-foreground'
                : 'border-transparent'} bg-muted text-[17px] font-medium uppercase text-muted-foreground"
            >
              <div
                class="flex h-full w-full items-center justify-center overflow-hidden rounded-full"
              >
                <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
                <Avatar.Fallback class="border border-muted">HB</Avatar.Fallback>
              </div>
            </Avatar.Root>
      
            <div class="name ml-2">
              <h3 class="text-foreground font-medium text-sm">Pája</h3>
              <p class="text-muted-foreground text-[12px] font-medium">@pavlanovotna</p>
            </div>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              class="focus-visible border-border-input bg-white text-a-foreground inline-flex h-8 w-8 select-none items-center justify-center rounded-[7px] border text-sm font-medium shadow-mini hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
            >
              <DotsThreeVertical class="size-5 text-foreground " />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                class="focus-override w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none focus-visible:outline-none"
                sideOffset={8}
              >
                <DropdownMenu.Item
                  class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
                >
                  <div class="flex items-center">
                    <UserCircle class="mr-2 size-5 text-foreground-alt" />
                    Profile
                  </div>
                  <div class="ml-auto flex items-center gap-px">
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
                    >
                      ⌘
                    </kbd>
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
                    >
                      P
                    </kbd>
                  </div>
                </DropdownMenu.Item>
    
                <DropdownMenu.Item
                  class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
                >
                  <div class="flex items-center">
                    <Cardholder class="mr-2 size-5 text-foreground-alt" />
                    Billing
                  </div>
                  <div class="ml-auto flex items-center gap-px">
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
                    >
                      ⌘
                    </kbd>
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
                    >
                      B
                    </kbd>
                  </div>
                </DropdownMenu.Item>
                
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
  
        <div class="flex items-center justify-between mb-3">
          <div class=" flex">
            <Avatar.Root
              bind:loadingStatus
              class="h-10 w-10 rounded-full border {loadingStatus === 'loaded'
                ? 'border-foreground'
                : 'border-transparent'} bg-muted text-[17px] font-medium uppercase text-muted-foreground"
            >
              <div
                class="flex h-full w-full items-center justify-center overflow-hidden rounded-full"
              >
                <Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
                <Avatar.Fallback class="border border-muted">HB</Avatar.Fallback>
              </div>
            </Avatar.Root>
      
            <div class="name ml-2">
              <h3 class="text-foreground font-medium text-sm">Pavel</h3>
              <p class="text-muted-foreground text-[12px] font-medium">@pavelstianko</p>
            </div>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              class="focus-visible border-border-input bg-white text-a-foreground inline-flex h-8 w-8 select-none items-center justify-center rounded-[7px] border text-sm font-medium shadow-mini hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
            >
              <DotsThreeVertical class="size-5 text-foreground " />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                class="focus-override w-[229px] rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover outline-none focus-visible:outline-none"
                sideOffset={8}
              >
                <DropdownMenu.Item
                  class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
                >
                  <div class="flex items-center">
                    <UserCircle class="mr-2 size-5 text-foreground-alt" />
                    Profile
                  </div>
                  <div class="ml-auto flex items-center gap-px">
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
                    >
                      ⌘
                    </kbd>
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
                    >
                      P
                    </kbd>
                  </div>
                </DropdownMenu.Item>
    
                <DropdownMenu.Item
                  class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
                >
                  <div class="flex items-center">
                    <Cardholder class="mr-2 size-5 text-foreground-alt" />
                    Billing
                  </div>
                  <div class="ml-auto flex items-center gap-px">
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-xs text-muted-foreground shadow-kbd"
                    >
                      ⌘
                    </kbd>
                    <kbd
                      class="inline-flex size-5 items-center justify-center rounded-button border border-dark-10 bg-background-alt text-[10px] text-muted-foreground shadow-kbd"
                    >
                      B
                    </kbd>
                  </div>
                </DropdownMenu.Item>
                
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  
  </div>  
</div>

<style lang="postcss">
  .outer {
    border: 1px solid #cacaca;
  }
</style>
