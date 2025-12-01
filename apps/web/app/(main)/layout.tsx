"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { CarTaxiFront, HomeIcon, LogOutIcon, MapPinned, NotebookTabsIcon, SettingsIcon, UsersIcon } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", emoji: <HomeIcon size={24} /> },
  { href: "/clients", label: "Clients", emoji: <UsersIcon size={24} /> },
  { href: "/drivers", label: "Drivers", emoji: <CarTaxiFront size={24} /> },
  { href: "/live-map", label: "Live map", emoji: <MapPinned size={24} /> },
  { href: "/orders", label: "Orders", emoji: <NotebookTabsIcon size={24} /> },
  { href: "/settings", label: "Settings", emoji: <SettingsIcon size={24} /> },
]

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  function handleLogout() {
    // Placeholder: wire to real logout flow
    alert("Logged out")
    router.push("/login")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-1 bg-background">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="group-data-[collapsible=icon]:p-0! h-14">
                  <div className="flex items-center gap-3">
                    <div className="min-h-10 min-w-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-medium">
                      JD
                    </div>
                    <div>
                      <div className="text-sm font-semibold">John Doe</div>
                      <div className="text-xs text-muted-foreground">Dispatcher</div>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild className="h-10">
                    <Link href={item.href} className="flex items-center gap-2 w-full">
                      <span>{item.emoji}</span>
                      <span className="truncate font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-10">
                  <span className="flex items-center gap-2 w-full">
                    <span><LogOutIcon size={24} /></span>
                    <span className="truncate font-medium">Logout</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="flex items-center justify-between border-b bg-background p-2 ">
            <SidebarTrigger />
          </div>
          <main className="flex flex-1 p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
