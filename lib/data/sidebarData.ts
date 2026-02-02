import {
  LayoutDashboardIcon,
  FileTextIcon,
  UsersIcon,
  PackageIcon,
  SettingsIcon,
  BarChart3Icon,
} from 'lucide-react';

export const sidebarData = {
  branding: {
    name: 'PawnShop',
    logo: '/logo.png',
  },
  user: {
    name: 'John Doe',
    email: 'john@pawnpro.com',
    avatar: '/avatars/user.jpg',
  },
  teams: [
    { name: 'Main St. Branch', plan: 'Enterprise Edition' },
    { name: 'Downtown Branch', plan: 'Enterprise Edition' },
    { name: 'East Side Branch', plan: 'Enterprise Edition' },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
      isActive: true,
    },
    {
      title: 'Loans',
      url: '/loans',
      icon: FileTextIcon,
      isActive: false,
    },
    {
      title: 'Customers',
      url: '/customers',
      icon: UsersIcon,
      isActive: false,
    },
    {
      title: 'Items',
      url: '/items',
      icon: PackageIcon,
      isActive: false,
    },
    {
      title: 'Masters',
      url: '/masters',
      icon: SettingsIcon,
      isActive: false,
    },
    {
      title: 'Reports',
      url: '/reports',
      icon: BarChart3Icon,
      isActive: false,
    },
  ],
  projects: [],
};
