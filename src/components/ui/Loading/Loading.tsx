import classes from './Loading.module.css';

interface LoadingProps {
    fullScreen?: boolean;
    size?: number;
    color?: string;
    message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
    fullScreen = false,
    size = 40,
    color = '#3b82f6',
    message,
}) => {

    const containerClass = fullScreen ? 
    `${classes.container} ${classes.fullScreen}` 
    : classes.container;

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div className={classes.spinner} style={{width: size, height: size, borderTopColor: color,}} />

    {message && <p className={classes.message}>{message}</p>}
      
    </div>
  )
}

