'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

const navItems = [
  { href: '/dashboard', label: 'Dashboard', emoji: <HomeIcon size={24} /> },
  { href: '/clients', label: 'Clients', emoji: <UsersIcon size={24} /> },
  { href: '/drivers', label: 'Drivers', emoji: <CarTaxiFront size={24} /> },
  { href: '/live-map', label: 'Live map', emoji: <MapPinned size={24} /> },
  { href: '/orders', label: 'Orders', emoji: <NotebookTabsIcon size={24} /> },
  { href: '/settings', label: 'Settings', emoji: <SettingsIcon size={24} /> },
  { href: '/operators', label: 'Operators', emoji: <ShieldUser size={24} /> },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  function handleLogout() {
    // Placeholder: wire to real logout flow
    alert('Logged out');
    router.push('/login');
  }

  // Zod schema for profile form
  const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().min(1, 'Phone is required'),
    avatar: z.any().optional(),
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      phone: '',
      avatar: undefined,
    },
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-1 bg-background">
        {/* Sidebar using UI components */}
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="group-data-[collapsible=icon]:p-0! h-14"
                >
                  <div className="flex items-center gap-3">
                    <div className="min-h-10 min-w-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-medium">
                      JD
                    </div>
                    <div className="flex items-center flex-1 gap-3">
                      <div className="flex flex-col flex-1">
                        <div className="text-sm font-semibold">John Doe</div>
                        <div className="text-xs text-muted-foreground">
                          Dispatcher
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
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogContent showCloseButton>
                            <DialogHeader>
                              <DialogTitle>Edit profile</DialogTitle>
                            </DialogHeader>
                            <Form {...profileForm}>
                              <form
                                onSubmit={profileForm.handleSubmit((data) => {
                                  console.log('Saved profile', data);
                                  alert('Profile saved (mock)');
                                })}
                                className="grid gap-4"
                              >
                                <div className="grid grid-cols-3 gap-3">
                                  <FormField
                                    control={profileForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={profileForm.control}
                                    name="middleName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Middle name</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={profileForm.control}
                                    name="lastName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <FormField
                                  control={profileForm.control}
                                  name="phone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Phone</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={profileForm.control}
                                  name="avatar"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Profile picture</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) =>
                                            field.onChange(e.target.files?.[0])
                                          }
                                          className="mt-1"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline" type="button">
                                      Cancel
                                    </Button>
                                  </DialogClose>
                                  <Button type="submit">Save</Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
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
          </div>
          <main className="flex flex-1 p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
