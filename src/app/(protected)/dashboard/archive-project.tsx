"use client";

import ConfirmationDialog from "@/app/_components/deleteConfiramtion";
import { Button } from "@/components/ui/button";
import { useProject } from "@/hooks/use-project";
import { useRefetch } from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ArchiveButton = () => {
  const archiveProject = api.project.archiveProject.useMutation();
  const { projectId } = useProject();
  const refetch = useRefetch();
  const router = useRouter();

  return (
    <>
      <ConfirmationDialog
        buttonText="Archive"
        description="Are you sure you want to archive this project?"
        title="Archive this project"
        onContinueClick={() => {
          archiveProject.mutate(
            { projectId },
            {
              onSuccess: () => {
                toast.success("project archived project");
                refetch();
                router.push("/dashboard");
              },
              onError: () => {
                toast.error("failed to archive project");
              },
            },
          );
        }}
      />
    </>
  );
};

export default ArchiveButton;
