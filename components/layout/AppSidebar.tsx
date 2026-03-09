'use client';
import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronsUpDownIcon } from 'lucide-react';
import { sidebarData } from '@/lib/data/sidebarData';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../ui/item';
import { useLogout } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/useUser';

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useLogout();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  const role = user?.role?.code?.toUpperCase();
  const initials = user?.username?.[0].toUpperCase() ?? 'U';

  const filteredNav = sidebarData.navMain.filter(item => {
    if (role === 'SUPERADMIN') return true;
    return item.title !== 'Masters' && item.title !== 'Register';
  });

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      // Remove cached current-user so UI no longer shows the signed-out user
      try {
        queryClient.removeQueries({ queryKey: ['current-user'] });
      } catch {}
      // After successful logout, send the user to the public homepage
      router.replace('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* HEADER */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1 hover:bg-sidebar-accent rounded-lg transition">
                  <Image
                    src={sidebarData.branding.logo}
                    alt={sidebarData.branding.name}
                    width={24}
                    height={24}
                  />
                  <span className="font-semibold text-sm">{sidebarData.branding.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* NAVIGATION */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {filteredNav.map(item => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      isActive={isActive}
                      className="hover:bg-sidebar-accent rounded-lg transition"
                    >
                      <Link href={item.url} className="flex items-center gap-2 px-2 py-2">
                        <item.icon className="size-4 text-muted-foreground" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* USER FOOTER */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="flex items-center gap-2 px-2 py-2 hover:bg-sidebar-accent rounded-lg transition data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left text-sm leading-tight">
                      <span className="font-medium truncate">{user?.username ?? 'User'}</span>
                      <span className="text-muted-foreground text-xs truncate">{user?.email ?? ''}</span>
                    </div>
                    <ChevronsUpDownIcon className="size-4 ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-60">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <Item size="sm">
                        <ItemMedia>
                          <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{user?.username}</ItemTitle>
                          <ItemDescription>{user?.email}</ItemDescription>
                        </ItemContent>
                      </Item>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-red-50 text-destructive">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* CONTENT */}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}