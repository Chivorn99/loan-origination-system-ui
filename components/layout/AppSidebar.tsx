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
import { useCurrentUser } from '@/hooks/useUser';

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const logout = useLogout();
  const router = useRouter();

  const { data: user } = useCurrentUser();

  const role = user?.role?.name?.toLowerCase();

  const filteredNav = sidebarData.navMain.filter(item => {
    if (role === 'admin') return true;

    return item.title !== 'Masters' && item.title !== 'Register';
  });

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      document.cookie = 'token=; path=/; max-age=0';
      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const initials =
    user?.role?.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('') ?? '';

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* HEADER */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="m-1 flex h-6 w-6 shrink-0 items-center justify-center">
                    <Image src={sidebarData.branding.logo} alt={sidebarData.branding.name} width={24} height={24} />
                  </div>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{sidebarData.branding.name}</span>
                  </div>
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
                    <SidebarMenuButton tooltip={item.title} asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
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
                    className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.role?.name ?? 'User'}</span>

                      <span className="text-muted-foreground truncate text-xs">{user?.email ?? ''}</span>
                    </div>

                    <ChevronsUpDownIcon className="size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <Item size={'sm'}>
                        <ItemMedia>
                          <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                        </ItemMedia>

                        <ItemContent>
                          <ItemTitle>{user?.role?.name}</ItemTitle>
                          <ItemDescription>{user?.email}</ItemDescription>
                        </ItemContent>
                      </Item>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
