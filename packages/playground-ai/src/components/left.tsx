'use client';

import { useSidebarStore } from '@/lib/models/sidebar';
import { cn, rem } from '@/lib/utils';

import { motion } from 'motion/react';
import { SideBar } from './sideBar/sideBar';

export default function Left({ className }: { className: string }) {
  const { isOpen } = useSidebarStore();
  return (
    <motion.div
      animate={{ width: isOpen ? rem(370) : rem(60) }}
      className={cn(`  text-white flex flex-col w-[370px] bg-transparent`, isOpen ? '' : 'w-[40px]', className)}
    >
      <SideBar />
    </motion.div>
  );
}
