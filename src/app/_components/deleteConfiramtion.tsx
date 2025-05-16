import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmationDialogProps = {
  buttonText: string;
  title: string;
  description: string;
  onContinueClick: () => void;
};

export default function ConfirmationDialog({
  buttonText,
  title,
  description,
  onContinueClick,
}: ConfirmationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-5">
          <DialogClose>Cancel</DialogClose>
          <Button onClick={onContinueClick}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
