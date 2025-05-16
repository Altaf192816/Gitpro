"use client";
import { useProject } from "@/hooks/use-project";
import { api } from "@/trpc/react";
import MeetingCard from "../dashboard/meeting-card";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/app/_components/deleteConfiramtion";

const MeetingPage = () => {
  const { projectId,isLoading:isProjectLoading } = useProject();
  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    {
      projectId: projectId,
    },
    { refetchInterval: 4000 },
  );

  const deleteMeeting = api.project.deleteMeeting.useMutation();

  const handleDeleteMeeting = (meetingId: string) => {
    deleteMeeting.mutate({ meetingId });
  };

  if (isLoading || isProjectLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle size={40} className="animate-spin" />
      </div>
    );

  return (
    <>
      <MeetingCard />
      <div className="h-6"></div>
      <h1 className="text-xl font-semibold">Meetings</h1>
      {meetings && meetings.length === 0 && <div>No meetings found</div>}
      <ul className="divide-y divide-gray-200">
        {meetings?.map((meeting) => (
          <li
            key={meeting.id}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/meetings/${meeting.id}`}
                    className="text-sm font-semibold"
                  >
                    {meeting.name}
                  </Link>
                  {meeting.status === "PROCESSING" && (
                    <Badge className="bg-yellow-400">
                      Processing <LoaderCircle className="animate-spin" />
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-2 text-xs text-gray-500">
                <p className="whitespace-nowrap">
                  {meeting.createdAt.toLocaleDateString()}
                </p>
                <p className="truncate">{meeting.Issue.length} issues</p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <Link href={`meetings/${meeting.id}`}>
                <Button size={"sm"} variant={"outline"}>
                  View Meeting
                </Button>
              </Link>
              <ConfirmationDialog
                buttonText="Delete"
                onContinueClick={() => handleDeleteMeeting(meeting.id)}
                description="Are you sure you want to delete this meeting?"
                title="Delete Meeting"
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MeetingPage;
