<script lang="ts">
	import { Dialog, AlertDialog } from "bits-ui";
</script>

<main>
	<!-- Dialog -> Alert Dialog -> Dialog -->
	<Dialog.Root>
		<Dialog.Trigger data-testid="dialog-open">dialog open</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay data-testid="dialog-overlay" />
			<Dialog.Content data-testid="dialog-content">
				<Dialog.Close data-testid="dialog-close">dialog close</Dialog.Close>
				<AlertDialog.Root>
					<AlertDialog.Trigger data-testid="alert-open">alert open</AlertDialog.Trigger>
					<AlertDialog.Portal>
						<AlertDialog.Overlay data-testid="alert-overlay" />
						<AlertDialog.Content data-testid="alert-content">
							<AlertDialog.Title data-testid="alert-title"
								>Alert Title</AlertDialog.Title
							>
							<AlertDialog.Description data-testid="alert-description"
								>Alert Description</AlertDialog.Description
							>
							<AlertDialog.Cancel data-testid="alert-cancel"
								>alert cancel</AlertDialog.Cancel
							>
							<AlertDialog.Action data-testid="alert-action"
								>alert action</AlertDialog.Action
							>
							<Dialog.Root>
								<Dialog.Trigger data-testid="nested-dialog-open"
									>nested dialog open</Dialog.Trigger
								>
								<Dialog.Portal>
									<Dialog.Overlay data-testid="nested-dialog-overlay" />
									<Dialog.Content data-testid="nested-dialog-content">
										<Dialog.Close data-testid="nested-dialog-close"
											>nested dialog close</Dialog.Close
										>
									</Dialog.Content>
								</Dialog.Portal>
							</Dialog.Root>
						</AlertDialog.Content>
					</AlertDialog.Portal>
				</AlertDialog.Root>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>

	<!-- Alert Dialog -> Dialog -->
	<AlertDialog.Root>
		<AlertDialog.Trigger data-testid="alert-first-open">alert first open</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay data-testid="alert-first-overlay" />
			<AlertDialog.Content data-testid="alert-first-content">
				<AlertDialog.Title data-testid="alert-first-title"
					>Alert First Title</AlertDialog.Title
				>
				<AlertDialog.Description data-testid="alert-first-description"
					>Alert First Description</AlertDialog.Description
				>
				<AlertDialog.Cancel data-testid="alert-first-cancel"
					>alert first cancel</AlertDialog.Cancel
				>
				<AlertDialog.Action data-testid="alert-first-action"
					>alert first action</AlertDialog.Action
				>
				<Dialog.Root>
					<Dialog.Trigger data-testid="dialog-nested-open"
						>dialog nested open</Dialog.Trigger
					>
					<Dialog.Portal>
						<Dialog.Overlay data-testid="dialog-nested-overlay" />
						<Dialog.Content data-testid="dialog-nested-content">
							<Dialog.Close data-testid="dialog-nested-close"
								>dialog nested close</Dialog.Close
							>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>

	<div id="portalTarget" data-testid="portalTarget"></div>
</main>
