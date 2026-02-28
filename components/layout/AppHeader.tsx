'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MapPinIcon, SearchIcon, BellIcon, SettingsIcon, MoonIcon } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-background flex h-16 items-center gap-4 border-b px-6">
      <SidebarTrigger />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <MapPinIcon className="size-4 text-blue-600" />
            <span className="font-medium">Main St. Branch</span>
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>

      <div className="relative max-w-md flex-1">
        <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input type="search" placeholder="Search loans, customers, collateral..." className="bg-muted/50 pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <BellIcon className="size-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="size-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoonIcon className="size-5" />
        </Button>
      </div>
    </header>
  );
}
