'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProject } from "@/hooks/use-project";
import { toast } from "sonner";

const InviteButton = () => {
  const { projectId } = useProject();
  const [open, setOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteUrl(`${window.location.origin}/join/${projectId}`);
    }
  }, [projectId]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Ask them to copy and paste the link</p>
          <Input
            className="mt-4"
            readOnly
            value={inviteUrl}
            onClick={() => {
              navigator.clipboard.writeText(inviteUrl);
              toast.success("Copied to clipboard");
            }}
          />
        </DialogContent>
      </Dialog>
      <Button onClick={() => setOpen(true)}>Invite</Button>
    </>
  );
};

export default InviteButton;
