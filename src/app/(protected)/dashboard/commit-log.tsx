"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CommitLog = () => {
  const { projectId, project } = useProject();
  const { data: commits, isLoading } = api.project.getCommits.useQuery({
    projectId,
  });

  if (isLoading)
    return Array.from({ length: 4 }, (_, i) => i).map((el) => (
      <Skeleton key={el} className="mb-2 h-12" />
    ));

  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, index) => (
          <li key={commit.id} className="relative flex gap-x-4">
            <div
              className={cn(
                index === commits.length - 1 ? "h-6" : "-bottom-6",
                "absolute top-0 left-0 flex w-6 justify-center",
              )}
            >
              <div className="w-px translate-x-1 bg-gray-200"></div>
            </div>
            <>
              <Image
                src={commit.commitAuthorAvatar}
                alt="commit-author"
                className="relative mt-4 flex-none size-8 rounded-full bg-gray-50"
                width={32}
                height={32}
              />
              <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-gray-200 ring-inset">
                <div className="flex justify-between gap-x-4">
                  <Link
                    target="_blank"
                    href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                    className="py-0.5 text-sm leading-5 text-gray-500"
                  >
                    <span className="font-medium text-gray-900">
                      {commit.commitAuthorName}
                    </span>{" "}
                    <span className="inline-flex items-center">
                      committed
                      <ExternalLink className="m-1 size-4" />
                    </span>
                  </Link>
                </div>
                <span className="font-semibold">{commit.commitMessage}</span>
                <pre className="mt-2 text-sm leading-6 whitespace-pre-wrap text-gray-500">
                  {commit.summary}
                </pre>
              </div>
            </>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CommitLog;
