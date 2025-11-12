import s from './navBar.module.scss';
import NavLink from '../NavLink/navLink';
import { Search, Music, Heart } from "@deemlol/next-icons";

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
		</div>
	)
}