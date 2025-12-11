'use server';

import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import { authConfig } from '../../../configs/auth';
import s from './ProfileCard.module.scss';
import { useState } from 'react';

export default async function ProfileCard() {
  const session = await getServerSession(authConfig);

  return(
    <div>
      <h1>Hello {session?.user?.name}</h1>
      {session?.user?.image && <img src={session?.user?.image} alt='' className={s.user_image} />}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}