
import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { DESIGN_TOKENS } from '../../theme/design-tokens';

// --- Retro Button ---

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const RetroButton: React.FC<RetroButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className = '', 
  loading,
  disabled,
  ...props 
}) => {
  // We use inline style for border-color to ensure it follows theme variables if needed, 
  // though Tailwind class border-os-border usually handles it.
  
  const baseStyles = "font-bold border-2 border-os-border shadow-retro-sm active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Updated to use OS theme colors
  const variants = {
    primary: "bg-os-accent text-white hover:bg-os-accentHover hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--os-border)]",
    secondary: "bg-os-window text-os-text hover:bg-os-bg hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--os-border)]",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--os-border)]",
    ghost: "bg-transparent border-transparent shadow-none text-os-muted hover:bg-os-bg hover:text-os-text active:translate-y-0"
  };

  const sizes = {
    sm: "px-3 py-1 text-xs",
    md: "px-6 py-2 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={size === 'sm' ? 12 : 16} />}
      {!loading && icon}
      {children}
    </button>
  );
};

// --- Retro Card ---

interface RetroCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const RetroCard: React.FC<RetroCardProps> = ({ children, className = '', hoverEffect = false, ...props }) => {
  // Using var(--os-border) for shadows manually to ensure it matches theme
  const shadowStyle = hoverEffect ? 
    { boxShadow: '6px 6px 0 0 var(--os-border)' } : 
    { boxShadow: '4px 4px 0 0 var(--os-border)' };

  const hoverClass = hoverEffect ? "hover:-translate-y-1 cursor-pointer" : "";
  
  return (
    <div 
      className={`bg-os-window border-2 border-os-border transition-transform duration-200 ${hoverClass} ${className}`}
      style={shadowStyle}
      {...props}
    >
      {children}
    </div>
  );
};

// --- Badge ---

export const RetroBadge: React.FC<{ label: string; colorClass?: string }> = ({ label, colorClass }) => (
  // Default to system colors if no colorClass provided
  <div className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide border border-os-border shadow-[1px_1px_0_0_rgba(0,0,0,0.1)] ${colorClass || 'bg-os-bg text-os-text'}`}>
    {label}
  </div>
);

// --- States ---

export const LoadingState: React.FC<{ message?: string }> = ({ message = "LOADING..." }) => (
  <div className="flex flex-col items-center justify-center h-48 gap-4 bg-os-bg border-2 border-os-border border-dashed animate-pulse">
    <Loader2 className="animate-spin text-os-accent" size={32} />
    <span className="text-xs font-bold text-os-muted">{message}</span>
  </div>
);

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({ message = "FAILED TO LOAD", onRetry }) => (
  <div className="flex flex-col items-center justify-center h-48 gap-4 bg-red-50 border-2 border-red-500">
    <span className="text-xs font-bold text-red-600">{message}</span>
    {onRetry && (
      <RetroButton variant="secondary" size="sm" onClick={onRetry} icon={<RefreshCw size={12} />}>
        RETRY
      </RetroButton>
    )}
  </div>
);
