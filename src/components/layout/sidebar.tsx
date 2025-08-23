"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Home, LogOut, User, LaptopMinimal, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useUser } from "@/context/user.context";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

// Main menu items
const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    badge: null,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    badge: null,
  },
  {
    title: "Personal Interviews",
    url: "/interview/personal",
    icon: LaptopMinimal,
    badge: null,
  },
  {
    title: "Custom Interviews",
    url: "/interview/custom",
    icon: FileText,
    badge: null,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathName = usePathname();
  const {
    user: { name, email, avatar },
    setUser,
  } = useUser();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(`Error signing out: ${error.message}`);
      }

      setUser({ id: "", name: "", email: "", avatar: null });
      toast.success("Log out successful!");
      router.push("/");
    } catch (err: any) {
      console.error("Error during logout:", err);
      toast.error(err.message || "Falied to log out!");
    }
  };

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarContent className="p-0">
        {/* Logo and Brand */}
        <div className="text-xl font-bold flex items-center px-4 py-5 border-b">
          Dashboard
        </div>

        <div className="px-2 py-2">
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground">
              MAIN MENU
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <TooltipProvider delayDuration={0}>
                  {mainItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              `group flex w-full items-center rounded-md px-3 py-2
                               hover:text-accent-foreground focus-visible:outline-none`,
                              pathName === item.url
                                ? `bg-blue-100 text-accent-foreground 
                                hover:bg-blue-100 hover:text-accent-foreground`
                                : "transparent"
                            )}
                          >
                            <Link
                              href={item.url}
                              className="flex w-full items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">
                                  {item.title}
                                </span>
                              </div>
                              {item.badge && (
                                <div
                                  className="flex h-5 w-5 items-center justify-center 
                                rounded-full bg-blue-600 text-xs font-medium text-white"
                                >
                                  {item.badge}
                                </div>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="flex items-center gap-2"
                        >
                          {item.title}
                          {item.badge && (
                            <span
                              className="flex h-5 w-5 items-center justify-center 
                            rounded-full bg-blue-600 text-xs font-medium text-white"
                            >
                              {item.badge}
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  ))}
                </TooltipProvider>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatar || ""} alt="User" />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex justify-between">
                <p className="text-sm font-medium">{name}</p>
                <button
                  onClick={handleLogout}
                  className="rounded-md p-1 hover:bg-accent"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
