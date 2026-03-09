import { LayoutDashboardIcon, FileTextIcon, UsersIcon, SettingsIcon, BarChart3Icon } from 'lucide-react';

export const sidebarData = {
  branding: {
    name: 'PawnShop',
    logo: '/logo.png',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
      roles: ['SUPERADMIN', 'ADMIN', 'STAFF'],
    },
    {
      title: 'Loans',
      url: '/loans',
      icon: FileTextIcon,
      roles: ['SUPERADMIN', 'ADMIN', 'STAFF'],
    },
    {
      title: 'Customers',
      url: '/customers',
      icon: UsersIcon,
      roles: ['SUPERADMIN', 'ADMIN', 'STAFF'],
    },
    {
      title: 'Masters',
      url: '/masters',
      icon: SettingsIcon,
      roles: ['SUPERADMIN', 'ADMIN'],
    },
    {
      title: 'Register',
      url: '/register',
      icon: BarChart3Icon,
      roles: ['SUPERADMIN'],
    },
  ],
};
