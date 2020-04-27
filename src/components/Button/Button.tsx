import React from 'react';
import styles from './Button.module.scss';

type ButtonProps = React.ComponentProps<'button'> & {
  palette?: 'normal' | 'danger';
};

const cn = (...cns: unknown[]) => cns.filter(cn => cn).join(' ');

const Button: React.FC<ButtonProps> = ({ palette = 'normal', className, children, ...rest }) => {
  return (
    <button {...rest} className={cn(styles.button, styles[palette], className)}>
      {children}
    </button>
  );
};

export default Button;
