'use client';

import s from './navLink.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { JSX, ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps): JSX.Element {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={isActive ? clsx(s.linkActive, s.link) : s.link}>
      {children}
    </Link>
  );
}
