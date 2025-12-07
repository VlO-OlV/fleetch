'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
} from '@/components/ui/sidebar';
import {
  CarTaxiFront,
  HomeIcon,
  LogOutIcon,
  MapPinned,
  NotebookTabsIcon,
  SettingsIcon,
  ShieldUser,
  UsersIcon,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { Route, UserRoleToLabelMap } from '@/lib/consts';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { UpdateProfileDto, updateProfileSchema } from '@/validation/user';
import { EditProfileDialog } from './components/EditProfileDialog';
import { getFileUrl } from '@/lib/utils';

const navItems = [
  { href: Route.DASHBOARD, label: 'Dashboard', icon: <HomeIcon size={24} /> },
  { href: Route.LIVE_MAP, label: 'Live map', icon: <MapPinned size={24} /> },
  { href: Route.CLIENTS, label: 'Clients', icon: <UsersIcon size={24} /> },
  { href: Route.DRIVERS, label: 'Drivers', icon: <CarTaxiFront size={24} /> },
  { href: Route.ORDERS, label: 'Orders', icon: <NotebookTabsIcon size={24} /> },
  { href: Route.OPERATORS, label: 'Operators', icon: <ShieldUser size={24} /> },
  { href: Route.SETTINGS, label: 'Settings', icon: <SettingsIcon size={24} /> },
];

export default function MainLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const { user, isLoading } = useUser({});
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(Route.LOGIN);
    }
  }, [user, isLoading]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-1 bg-background">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="group-data-[collapsible=icon]:p-0! h-14"
                >
                  <div className="flex items-center gap-3">
                    {user.profileImageId ? (
                      <img
                        src={getFileUrl(user.profileImageId)}
                        alt="Profile image"
                        className="h-10 aspect-square rounded-full object-cover object-center"
                      />
                    ) : (
                      <div className="min-h-10 min-w-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-medium">
                        {`${user.firstName[0]}${user.lastName[0]}`}
                      </div>
                    )}
                    <div className="flex items-center flex-1 gap-3">
                      <div className="flex flex-col flex-1">
                        <div className="text-sm font-semibold line-clamp-1 break-all">
                          {user.firstName + user.firstName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user?.role ? UserRoleToLabelMap[user?.role] : '-'}
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          Edit
                        </Button>
                        <EditProfileDialog
                          isOpen={isDialogOpen}
                          onOpenChange={(value) => setIsDialogOpen(value)}
                        />
                      </div>
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
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 w-full"
                    >
                      <span>{item.icon}</span>
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
                <SidebarMenuButton
                  asChild
                  className="h-10"
                  onClick={() => logout()}
                >
                  <span className="flex items-center gap-2 w-full">
                    <span>
                      <LogOutIcon size={24} />
                    </span>
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
            <Select onValueChange={setLang} value={lang}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="uk">Українська</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <main className="flex flex-1 p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
