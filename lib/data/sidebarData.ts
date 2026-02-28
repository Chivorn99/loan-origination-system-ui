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
    },
    {
      title: 'Loans',
      url: '/loans',
      icon: FileTextIcon,
    },
    {
      title: 'Customers',
      url: '/customers',
      icon: UsersIcon,
    },
    {
      title: 'Masters',
      url: '/masters',
      icon: SettingsIcon,
    },
    {
      title: 'Register',
      url: '/register',
      icon: BarChart3Icon,
    },
  ],
};
