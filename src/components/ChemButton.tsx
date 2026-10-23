import React from 'react';
import './ChemButton.css';

export type ChemButtonVariant = 'primary' | 'secondary' | 'ghost' | 'teal';

export interface ChemButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChemButtonVariant;
  label?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const ChemButton: React.FC<ChemButtonProps> = ({
  variant = 'primary',
  label,
  children,
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`chem-btn chem-btn--${variant}${fullWidth ? ' chem-btn--full' : ''} ${className}`}
      {...rest}
    >
      <span className="chem-btn__text">{children || label}</span>
      <span className="chem-btn__line" aria-hidden="true" />
    </button>
  );
};

export default ChemButton;
