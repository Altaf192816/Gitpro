"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProject } from "@/hooks/use-project";
import { Skeleton } from "@/components/ui/skeleton";

const sidebarConfig = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  // {
  //   title: "Billing",
  //   url: "/billing",
  //   icon: CreditCard,
  // },
];

export function AppSidebar() {
  const pathName = usePathname();
  const { open } = useSidebar();
  const { projectId, projects, setProjectId, isLoading } = useProject();

  const handleProjectClick = (projectId: string) => {
    setProjectId(projectId);
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image
            src="/git-pro.svg"
            alt="logo"
            width={40}
            height={50}
            className="bg-primary rounded-3xl"
          />
          {open && (
            <h1 className="text-primary/80 text-xl font-bold">GitPro</h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarConfig.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn({
                          "bg-primary text-white": pathName === item.url,
                        })}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                <>
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                </>
              ) : (
                projects?.map((project) => {
                  return (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton asChild>
                        <div onClick={() => handleProjectClick(project.id)}>
                          <div
                            className={cn(
                              "text-primary flex size-8 items-center justify-center rounded-sm border bg-white text-sm",
                              {
                                "bg-primary text-white":
                                  project.id === projectId,
                              },
                            )}
                          >
                            {project.name[0]?.toUpperCase()}
                          </div>
                          <span>{project.name}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
              <div className="h-2"></div>
              <SidebarMenuItem>
                <Link href="/create">
                  <Button variant="outline" size="sm" className="w-fit">
                    <Plus />
                    {open && <span>Create Project</span>}
                  </Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
