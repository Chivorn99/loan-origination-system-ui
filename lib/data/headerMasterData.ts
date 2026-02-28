import { LayoutDashboardIcon, FileTextIcon, PackageIcon, SettingsIcon } from 'lucide-react';

export const masterNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Loans',
    url: '/loans',
    icon: FileTextIcon,
  },
  {
    title: 'Inventory',
    url: '/inventory',
    icon: PackageIcon,
  },
  {
    title: 'Master Data',
    url: '/master-data',
    icon: SettingsIcon,
  },
];
