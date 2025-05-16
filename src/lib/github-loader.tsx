import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import type { Document } from "@langchain/core/documents";
import { doc } from "prettier";
import { generateEmbedding, summariesCode } from "./gemini";
import { db } from "@/server/db";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken,
    branch: "main",
    ignoreFiles: [
      "yarn.lock",
      "package-lock.json",
      "pnpm-lock.yaml",
      "bun-lock.yaml",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });
  const docs = await loader.load();  
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  gitHubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, gitHubToken);
  console.log("doc",doc)
  const allEmbeddings = await generateEmbeddings(docs);
  await Promise.allSettled(
    allEmbeddings.map( async (embedding, index) => {
      if(!embedding) return;

      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          projectId,
          summary: embedding.summary ?? "",
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
        },
      })

      await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
      `
    }),
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = await summariesCode(doc);
      const embedding = await generateEmbedding(summary ?? "");

      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
        fileName: doc.metadata.source,
      };
    }),
  );
};
