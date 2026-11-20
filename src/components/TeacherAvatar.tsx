'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';

interface TeacherAvatarProps {
  src?: string;
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const GRADIENTS = [
  'from-blue-600 to-indigo-800',
  'from-amber-500 to-orange-700',
  'from-emerald-600 to-teal-800',
  'from-purple-600 to-violet-800',
  'from-rose-500 to-pink-700',
];

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({
  src,
  name,
  className = '',
  size = 'md',
}) => {
  const [imageError, setImageError] = useState(false);

  // Derive initials
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  // Consistent gradient based on name hash
  const charSum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradient = GRADIENTS[charSum % GRADIENTS.length];

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-base',
    lg: 'w-24 h-24 text-xl',
    xl: 'w-28 h-28 text-2xl',
  };

  if (!src || imageError) {
    return (
      <div
        className={`rounded-full bg-gradient-to-tr ${gradient} text-white font-display font-extrabold flex items-center justify-center shadow-inner select-none shrink-0 ${sizeClasses[size]} ${className}`}
        title={name}
      >
        <span>{initials || 'BK'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImageError(true)}
      className={`rounded-full object-cover shrink-0 select-none ${sizeClasses[size]} ${className}`}
    />
  );
};
