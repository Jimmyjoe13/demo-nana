import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { useChat } from "@/hooks/use-chat";

export function MessageLimitModal() {
  const { showMessageLimitModal, closeMessageLimitModal } = useChat();
  
  return (
    <AlertDialog open={showMessageLimitModal} onOpenChange={closeMessageLimitModal}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center text-warning text-4xl mb-2">
            <AlertCircle className="h-10 w-10" />
          </div>
          <AlertDialogTitle className="text-center">Limite de messages atteinte</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Vous avez atteint votre limite quotidienne de 20 messages. La limite se réinitialise après 24 heures.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center">
          <AlertDialogAction>J'ai compris</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
