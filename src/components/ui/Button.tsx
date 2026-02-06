import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) => {
  const variantClass = styles[variant];
  const widthClass = fullWidth ? styles.fullWidth : '';

  return (
    <button
      className={`${styles.button} ${variantClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
