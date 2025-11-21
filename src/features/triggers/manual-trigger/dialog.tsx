"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onopenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({ open, onopenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onopenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>
            Configure the settings for manual trigger node.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Used to manually trigger a workflow, no configuration available.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
