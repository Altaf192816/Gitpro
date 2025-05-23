"use client";
import { useProject } from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { Github, LoaderCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import MeetingCard from "./meeting-card";
import ArchiveButton from "./archive-project";
import InviteButton from "./invite-button";
import TeamMember from "./team-member";

const DashBoardPage = () => {
  const { project, isLoading } = useProject();

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle size={40} className="animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="item-center flex flex-wrap justify-between gap-y-4">
        <div className="bg-primary w-fit rounded-md px-4 py-3">
          <div className="flex items-center">
            <Github className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                This project is linked to{" "}
                <Link
                  href={project?.githubUrl ?? ""}
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.githubUrl}
                  {<SquareArrowOutUpRight className="ml-1 size-4" />}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="h-4"></div>
        <div className="flex items-center gap-4">
          <TeamMember />
          <InviteButton />
          <ArchiveButton />
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard />
          <MeetingCard />
        </div>
      </div>
      <div className="mt-8"></div>
      <CommitLog />
    </div>
  );
};

export default DashBoardPage;
