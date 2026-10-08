import React from 'react';
import classes from './Loading.module.css';

export type LoadingVariant = 'fullscreen' | 'overlay' | 'inline';

interface LoadingProps {
    variant?: LoadingVariant;
    fullScreen?: boolean;
    isLoading?: boolean;
    size?: number;
    color?: string;
    message?: string;
    className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    variant = 'inline',
    fullScreen,
    isLoading = true,
    size = 36,
    color,
    message,
    className = '',
}) => {
    if(!isLoading) return null;

    const activeVariant: LoadingVariant = fullScreen ? 'fullscreen' : variant;

    const variantClassMap: Record<LoadingVariant, string> = {
      fullscreen: classes.fullscreen,
      overlay: classes.overlay,
      inline: classes.inline,
    };

    const selectedVariantClass = variantClassMap[activeVariant];

  return (
    <div className={`${classes.baseContainer} ${selectedVariantClass} ${className}`.trim()}
     role="status" 
     aria-live="polite"
     aria-busy="true">
      <div className={classes.spinner} 
      style={{width: size, 
      height: size, 
      borderTopColor: color || '#cdb2f8'}} />

    {message && <p className={classes.message}>{message}</p>}
      
    </div>
  )
};

export default Loading;