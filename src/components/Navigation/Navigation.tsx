'use client';

import s from './Navigation.module.scss';
import NavLink from '../NavLink/NavLink';
import { Search, Music, Heart, User } from "@deemlol/next-icons";

export default function NavBar() {
	return(
		<div className={s.container}>
			
			<nav className={s.nav}>
				<NavLink href={'/search'}>
					<Search size={24} />
					<span>Поиск</span>
				</NavLink>

				<NavLink href={'/'}>
					<Music size={24} />
					<span>Главная</span>
				</NavLink>

				<NavLink href={'/favorites'}>
					<Heart size={24} />
					<span>Избранное</span>
				</NavLink>
			</nav>

			<NavLink href={'/profile'}>
				<User size={24} />
			</NavLink>
		</div>
	)
}