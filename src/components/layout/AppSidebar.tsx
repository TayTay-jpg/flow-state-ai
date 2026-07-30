import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  User,
  Settings,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const workspace = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Smart Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Notes Summarizer", url: "/meetings", icon: NotebookPen },
  { title: "AI Task Planner", url: "/planner", icon: ListChecks },
] as const;

const account = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help & Support", url: "/help", icon: LifeBuoy },
  { title: "Responsible AI", url: "/responsible-ai", icon: ShieldCheck },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const renderItems = (items: readonly { title: string; url: string; icon: typeof Mail }[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
            <Link to={item.url} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Aurelia AI</p>
              <p className="truncate text-xs text-muted-foreground">Workplace Assistant</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(workspace)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>{renderItems(account)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && (
          <div className="rounded-xl bg-accent/60 p-3 text-xs text-accent-foreground">
            AI can make mistakes. Always review generated content before sending.
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}