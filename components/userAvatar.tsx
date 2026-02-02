'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserAvatarProps = {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: 'size-6 text-xs',
  md: 'size-8 text-sm',
  lg: 'size-10 text-base',
};

export function UserAvatar({ name, avatar, size = 'md' }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar className={sizeMap[size]}>
      {avatar && <AvatarImage src={avatar} alt={name} />}
      <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
    </Avatar>
  );
}
