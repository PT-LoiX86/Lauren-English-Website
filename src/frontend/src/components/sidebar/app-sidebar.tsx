import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  School,
  LayoutDashboard,
  GraduationCap,
  BookType,
  Database,
  ShieldCheck,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { useAuthStore } from "@/stores/AuthStore";
import { apiClient } from "@/api/Client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface ClassroomDTO {
  id: string;
  name: string;
  status: string;
  teacherName: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const { data: classrooms = [], isLoading } = useQuery({
    queryKey: ["classrooms", user?.userId],

    queryFn: async () => {
      const response = await apiClient.get<ClassroomDTO[]>("/classrooms");
      return response.data;
    },

    enabled: !!user,

    // Optional: Keep the data fresh for 5 minutes
    staleTime: 1000 * 60 * 5,
  });

  const isTeacher = user?.role === "TEACHER";
  const isAdmin = user?.role === "ADMIN";

  const classroomSubItems: { title: string; url: string }[] = [];

  if (isTeacher) {
    classroomSubItems.push({
      title: "Manage classrooms",
      url: "/classrooms/manage",
    });
  }

  if (isLoading) {
    classroomSubItems.push({ title: "Loading...", url: "#" });
  } else if (classrooms.length > 0) {
    classrooms.forEach((classroom) => {
      classroomSubItems.push({
        title: classroom.name,
        url: `/classrooms/${classroom.id}`,
      });
    });
  } else if (!isTeacher) {
    classroomSubItems.push({ title: "No classrooms available!", url: "#" });
  }

  const dynamicNav = React.useMemo(() => {
    const nav = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Dictionary",
        url: "/dictionary",
        icon: BookType,
      },
      {
        title: "Classrooms",
        url: "/classrooms",
        icon: School,
        items: classroomSubItems,
      },
    ];

    if (isTeacher || isAdmin) {
      nav.push({
        title: "Question Bank",
        url: "/question-bank",
        icon: Database,
      });
    }

    if (isAdmin) {
      nav.push({
        title: "Administration",
        url: "/admin",
        icon: ShieldCheck,
      });
    }

    return nav;
  }, [classroomSubItems, isTeacher, isAdmin]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-sidebar-primary-foreground">
                <GraduationCap className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-base">
                  Lauren English
                </span>
                <span className="truncate text-xs">Learning Platform</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={dynamicNav} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
