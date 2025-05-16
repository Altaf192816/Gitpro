import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummarizeCommit } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type CommitHashesResponse = {
  commitMessage: string;
  commitHash: string;
  commitDate: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<CommitHashesResponse[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);

  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort(
    (a, b) =>
      new Date(b.commit.author?.date ?? "").getTime() -
      new Date(a.commit.author?.date ?? "").getTime(),
  );

  return sortedCommits.slice(0, 15).map((commit) => ({
    commitHash: commit.sha,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit.author?.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: commit.commit.author?.date ?? "",
  }));
};

export const pollCommit = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unProcessedCommits = await getUnProcessedCommits(
    projectId,
    commitHashes,
  );

  const commitSummariesResponse = await Promise.allSettled(
    unProcessedCommits.map(async (commit) => {
      return summarizeCommit(githubUrl, commit.commitHash);
    }),
  );

  console.log("summaries " + JSON.stringify(commitSummariesResponse));

  const summaries = commitSummariesResponse.map((summary) => {
    if (summary.status === "fulfilled") {
      return summary.value;
    }

    return "";
  });

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => ({
      projectId,
      summary,
      commitHash: unProcessedCommits[index]!.commitHash,
      commitMessage: unProcessedCommits[index]!.commitMessage,
      commitDate: unProcessedCommits[index]!.commitDate,
      commitAuthorName: unProcessedCommits[index]!.commitAuthorName,
      commitAuthorAvatar: unProcessedCommits[index]!.commitAuthorAvatar,
    })),
  });

  return commits;
};

const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return { project, githubUrl: project.githubUrl };
};

async function getUnProcessedCommits(
  projectId: string,
  commitHashes: CommitHashesResponse[],
) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });

  const unProcessedCommitHashes = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );

  return unProcessedCommitHashes;
}

const summarizeCommit = async (githubUrl: string, commitHash: string) => {
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });

  const summary = await aiSummarizeCommit(data);

  return summary ?? "";
};
