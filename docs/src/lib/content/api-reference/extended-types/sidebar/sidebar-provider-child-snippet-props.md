```ts
type ChildSnippetProps = {
	state: "expanded" | "collapsed"
	open: boolean
	openMobile: boolean
	isMobile: boolean
	setOpen: (open: boolean) => void
	setOpenMobile: (open: boolean) => void
	toggle: () => void
	props: Record<string, unknown>
}
```
