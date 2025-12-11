'use client';

import s from './NavLink.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={isActive ? clsx(s.linkActive, s.link) : clsx(s.link, 'link')}>
      {children}
    </Link>
  );
}
