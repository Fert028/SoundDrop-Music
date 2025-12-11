'use client';

import s from './Button.module.scss';

export default function Button({type, disabled, onClick, children}) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={s.button}>{children}</button>
  )
}