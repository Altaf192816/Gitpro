"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks/use-project";
import { api } from "@/trpc/react";
import Image from "next/image";

const TeamMember = () => {
  const { projectId } = useProject();
  const { data: teamMembers, isLoading } = api.project.getTeamMembers.useQuery({
    projectId,
  });

  if (isLoading) return <Skeleton className="size-[30px] rounded-full" />;

  return (
    <div className="flex items-center gap-2">
      {teamMembers?.map((member) => (
        <Image
          className="rounded-full"
          key={member.id}
          src={member.user.imageUrl || ""}
          alt={member.user.firstName || ""}
          width={30}
          height={30}
        />
      ))}
    </div>
  );
};

export default TeamMember;
