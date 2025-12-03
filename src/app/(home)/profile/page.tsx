'use client';

import s from './profile.module.scss';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProfileCard from '@/components/ProfileCard/ProfileCard';

export default function Profile() {
  const session = useSession();

  console.log(session);

  return(
    <div className={s.container}>
      {session?.data ? 
        <ProfileCard />
         : 
        <Link href={'api/auth/signin'}>Sign In Google</Link>}
    </div>
  )
}