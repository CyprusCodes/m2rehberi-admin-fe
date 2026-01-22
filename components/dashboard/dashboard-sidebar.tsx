"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  Server,
  MessageSquare,
  Megaphone,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Tags,
  // Package, // Unused
  ShieldCheck,
  Image,
  Video,
  Flag,
  Trophy,
  Bell,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Servers",
    href: "/admin/servers",
    icon: Server,
  },
  {
    name: "Bildirimler",
    href: "/admin/push-notifications",
    icon: Bell,
  },
  {
    name: "Yayıncılar",
    href: "/admin/streamers",
    icon: Video,
    submenu: [
      {
        name: "Yayıncıları Yönet",
        href: "/admin/streamers",
        icon: Video,
      },
      {
        name: "Postları Yönet",
        href: "/admin/streamers/posts",
        icon: MessageSquare,
      },
      {
        name: "Bekleyen Bildirimler",
        href: "/admin/pending-notifications",
        icon: Bell,
      },
    ],
  },
  {
    name: "Raporlanan Postlar",
    href: "/admin/reported-posts",
    icon: Flag,
  },
  {
    name: "Tags",
    href: "/admin/tags",
    icon: Tags,
  },
  {
    name: "Advertisement",
    href: "/admin/advertisement",
    icon: Megaphone,
  },
  {
    name: "Çekilişler",
    href: "/admin/lottery",
    icon: Trophy,
  },
  {
    name: "Carousel",
    href: "/admin/carousel",
    icon: Image,
  },
  {
    name: "User Role Requests",
    href: "/admin/server-owner-requests",
    icon: ShieldCheck,
  },
  {
    name: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [supportOpen, setSupportOpen] = useState(false); // Default closed to be cleaner
  const [streamersOpen, setStreamersOpen] = useState(false); // Default closed
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300 ease-in-out relative z-20",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-sm">
                MP
              </span>
            </div>
            <span className="font-bold text-lg truncate">OynaGG</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          <TooltipProvider delayDuration={0}>
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.submenu &&
                    item.submenu.some((sub) => pathname === sub.href));

                if (item.submenu) {
                  return (
                    <div key={item.name} className="flex flex-col gap-1">
                      {collapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              size="icon"
                              className={cn("h-10 w-10 mx-auto")}
                              onClick={() => setCollapsed(false)} // Expand to show submenu
                            >
                              <item.icon className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{item.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className="w-full justify-between h-10 px-3 font-normal"
                            onClick={() => setStreamersOpen((prev) => !prev)}
                          >
                            <span className="flex items-center gap-3">
                              <item.icon className="h-4 w-4" />
                              <span className="truncate">{item.name}</span>
                            </span>
                            {streamersOpen ? (
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            ) : (
                              <ChevronRight className="h-4 w-4 opacity-50" />
                            )}
                          </Button>
                          {streamersOpen && (
                            <div className="pl-4 space-y-1 mt-1 border-l ml-3 border-border/50">
                              {item.submenu.map((subItem) => {
                                const isSubActive = pathname === subItem.href;
                                return (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className="block"
                                  >
                                    <Button
                                      variant={
                                        isSubActive ? "secondary" : "ghost"
                                      }
                                      className="w-full justify-start h-9 px-3 text-sm font-normal"
                                    >
                                      {/* <subItem.icon className="h-3 w-3 mr-2" /> */}
                                      <span className="truncate">
                                        {subItem.name}
                                      </span>
                                    </Button>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={item.name}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={item.href} className="block">
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              size="icon"
                              className={cn("h-10 w-10 mx-auto")}
                            >
                              <item.icon className="h-5 w-5" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link href={item.href} className="block">
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3 h-10 px-3 font-normal"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="truncate">{item.name}</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Support accordion */}
              <div className="pt-2 mt-2 border-t border-border/50">
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          pathname.startsWith("/admin/support")
                            ? "secondary"
                            : "ghost"
                        }
                        size="icon"
                        className={cn("h-10 w-10 mx-auto")}
                        onClick={() => setCollapsed(false)}
                      >
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Support</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <Button
                      variant={
                        pathname.startsWith("/admin/support")
                          ? "secondary"
                          : "ghost"
                      }
                      className="w-full justify-between h-10 px-3 font-normal"
                      onClick={() => setSupportOpen((prev) => !prev)}
                    >
                      <span className="flex items-center gap-3">
                        <MessageSquare className="h-4 w-4" />
                        <span className="truncate">Support</span>
                      </span>
                      {supportOpen ? (
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      ) : (
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      )}
                    </Button>
                    {supportOpen && (
                      <div className="pl-4 space-y-1 mt-1 border-l ml-3 border-border/50">
                        <Link
                          href="/admin/support/categories"
                          className="block"
                        >
                          <Button
                            variant={
                              pathname === "/admin/support/categories"
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-start h-9 px-3 text-sm font-normal"
                          >
                            Kategoriler
                          </Button>
                        </Link>
                        <Link href="/admin/support/tickets" className="block">
                          <Button
                            variant={
                              pathname === "/admin/support/tickets"
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-start h-9 px-3 text-sm font-normal"
                          >
                            Ticketlar
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </nav>
          </TooltipProvider>
        </div>
      </ScrollArea>
    </div>
  );
}
