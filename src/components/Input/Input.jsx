"use client";

import s from './Input.module.scss';

export default function Input({
  name = "",
  type = "text",
  placeholder = "",
  value,
  onChange,
  ...props
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={s.input}
      {...props}
    />
  );
}