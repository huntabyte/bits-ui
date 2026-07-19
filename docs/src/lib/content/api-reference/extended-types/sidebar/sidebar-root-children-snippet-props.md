```ts
type ChildrenSnippetProps = {
	state: "expanded" | "collapsed"
	open: boolean
	openMobile: boolean
	isMobile: boolean
	setOpen: (open: boolean) => void
	setOpenMobile: (open: boolean) => void
	toggle: () => void
	side: "left" | "right"
	variant: "sidebar" | "floating" | "inset"
	collapsible: "offcanvas" | "icon" | "none"
}
```
