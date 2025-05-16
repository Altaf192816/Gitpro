"use client";

import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useProject } from "@/hooks/use-project";
import Image from "next/image";
import { useState } from "react";
import { askQuestion } from "./actions";
import { readStreamableValue } from "ai/rsc";
import CodeReference from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRefetch } from "@/hooks/use-refetch";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [fileReference, setFileReference] = useState<
    {
      fileName: string;
      sourceCode: string;
      summary: string;
    }[]
  >([]);
  const saveAnswer = api.project.saveAnswer.useMutation();
  const refetch = useRefetch();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFileReference([]);
    setAnswer("");

    if (!project?.id) return;

    setOpen(true);
    setLoading(true);
    const { fileReference, output } = await askQuestion(question, project.id);
    setFileReference(fileReference);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((prev) => prev + delta);
      }

      setLoading(false);
    }
  };

  const handleSaveAnswer = () => {
    saveAnswer.mutate(
      {
        projectId: project!.id,
        question,
        answer,
        fileReference,
      },
      {
        onSuccess: () => {
          toast.success("Answer Saved");
          refetch();
        },
        onError: () => {
          toast.error("Failed to save Answer");
        },
      },
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[80vh] overflow-auto sm:max-w-[80vw]">
          <DialogHeader>
            <div className="item-center flex gap-2">
              <DialogTitle>
                <Image
                  src={"git-pro.svg"}
                  alt="git-pro-logo"
                  width={32}
                  height={32}
                />
              </DialogTitle>
              <Button
                disabled={saveAnswer.isPending}
                onClick={handleSaveAnswer}
                variant={"outline"}
              >
                Save
              </Button>
            </div>
          </DialogHeader>
          <MDEditor.Markdown
            source={answer}
            className="h-[30vh] max-w-[80vw] overflow-auto"
          />
          <div className="h-4"></div>
          <CodeReference fileReference={fileReference} />
          <Button onClick={() => setOpen(false)} type="button">
            Close
          </Button>
        </DialogContent>
      </Dialog>
      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle className="px-1">Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              className="h-[140px]"
              value={question}
              placeholder="What is this project about?"
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
            />
            <div className="h-4"></div>
            <Button disabled={loading} type="submit">
              Ask GitPro
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
