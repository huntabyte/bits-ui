---
"bits-ui": patch
---

fix(LinkPreview): always remove the document `pointerup` listener registered while open. When the content node wasn't attached yet, the open watcher returned early before its cleanup, so the listener was never unsubscribed and kept firing after the preview closed or unmounted.
