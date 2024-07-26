import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// Props definition for the DialogComponent
interface DialogProps {
    title: string; // Title displayed at the top of the alert dialog
    open: boolean; // Boolean to control the visibility of the alert dialog
    children: React.ReactNode; // Content of the alert dialog, can be any React node
    dismissible: boolean; // Determines if the alert dialog can be closed by the user
    setOpen?: (open: boolean) => void; // Function to update the visibility state of the dialog
}

/**
 * DialogComponent - A customizable alert dialog using Radix UI for accessibility.
 *
 * This component displays a modal dialog with a title, custom content, and an optional close button.
 * It leverages Radix UI's AlertDialog for accessibility features and animations.
 */
const DialogComponent: React.FC<DialogProps> = ({ title, open, children, dismissible, setOpen }) => {
    // Handle the close action of the alert dialog
    const handleClose = () => {
        if (dismissible && setOpen) {
            setOpen(false);
        }
    };

    return (
        <AlertDialog.Root open={open} onOpenChange={handleClose}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30" />
                <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 rounded-md bg-slate-100 p-4 text-slate-700 shadow-md md:w-1/3 dark:bg-gray-700 dark:text-gray-200">
                    <div className="flex items-center justify-between">
                        <AlertDialog.Title className="text-xl font-bold">{title}</AlertDialog.Title>
                        {dismissible && (
                            <button className="p-2" onClick={handleClose}>
                                <FontAwesomeIcon icon={faTimes} className="text-xl" />
                            </button>
                        )}
                    </div>
                    <AlertDialog.Description>{children}</AlertDialog.Description>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};

export default DialogComponent;
