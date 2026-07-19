```ts
type ChildSnippetProps = {
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
	props: Record<string, unknown>
}
```
