"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useState } from "react";

type CodeReferenceProps = {
  fileReference: { fileName: string; sourceCode: string; summary: string }[];
};

const CodeReference = ({ fileReference }: CodeReferenceProps) => {
  const [tab, setTab] = useState(fileReference[0]?.fileName);
  if (fileReference.length === 0) return null;

  console.log(fileReference);

  return (
    <div className="max-w-[70vw]">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex gap-2 overflow-auto rounded-md bg-gray-200 p-1">
          {fileReference.map((file) => (
            <button
              onClick={() => setTab(file.fileName)}
              key={file.fileName}
              className={cn(
                "text-muted-foreground hover:bg-muted rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                {
                  "bg-primary text-primary-foreground": tab === file.fileName,
                },
              )}
            >
              {file.fileName}
            </button>
          ))}
        </div>
        {fileReference.map((file) => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="max-h-[50vh] max-w-[80vw] overflow-auto rounded-md"
          >
            <SyntaxHighlighter language="typescript" style={oneDark}>
              {file.sourceCode}
            </SyntaxHighlighter>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeReference;
