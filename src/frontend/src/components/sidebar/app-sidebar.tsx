import * as React from "react";
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  // TEMPORARY MOCK DATA (will replaced with an API call later)
  const mockClassrooms = [];

  const isTeacher = user?.role === "TEACHER";
  const isAdmin = user?.role === "ADMIN";

  const classroomSubItems = [];

  if (isTeacher) {
    classroomSubItems.push({
      title: "Manage classrooms",
      url: "/classrooms/manage",
    });
  }

  if (mockClassrooms.length > 0) {
    mockClassrooms.forEach((classroom) => {
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

    // Role-based additions: Only push these if the user has the correct role
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
