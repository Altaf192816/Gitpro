import IssueList from "./issues-list";

type MeetingProps = {
  params: Promise<{ meetingId: string }>;
};

const MeetingDetailPage = async ({ params }: MeetingProps) => {
  const { meetingId } = await params;

  return <IssueList meetingId={meetingId} />;
};

export default MeetingDetailPage;
