"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderCircle  } from 'lucide-react';
import { useRefetch } from "@/hooks/use-refetch";
import Image from "next/image";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch()

  const onSubmit = (data: FormInput) => {
    createProject.mutate(
      {
        repoUrl: data.repoUrl,
        projectName: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully!");
          refetch();
          reset();
        },
        onError: (error) => {
          toast.error("Error creating project: " + error.message);
        },
      },
    );

    return true;
  };

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <Image src="/project-planing.svg" className="h-72 w-auto" alt="project-planing" height={288} width={288}/>
      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your GitHub Repository
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the Url of your GitHub repository to link it to GitPro
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("repoUrl", { required: true })}
              placeholder="GitHub Repository URL"
              required
              type="url"
            />
            <div className="h-2"></div>
            <Input {...register("githubToken")} placeholder="GitHub Token" />
            <div className="h-4"></div>
            <Button type="submit" disabled={createProject.isPending}>
              Create Project
              {createProject.isPending && (
                <LoaderCircle  className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
