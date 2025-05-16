import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  cancelText?: string;
  confirmText?: string;
  isOpen: boolean;
  message: string;
  onConfirm?: () => void;
  onOpenChange: (open: boolean) => void;
  title: string;
}

export const ConfirmationModal = ({
  cancelText = "Cancel",
  confirmText = "Confirm",
  isOpen,
  message,
  onConfirm,
  onOpenChange,
  title,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-8">
          <DialogDescription>{message}</DialogDescription>
        </div>
        <DialogFooter>
          {onConfirm && (
            <Button onClick={() => onOpenChange(false)} variant="outline">
              {cancelText}
            </Button>
          )}
          <Button onClick={onConfirm} variant="default">
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
