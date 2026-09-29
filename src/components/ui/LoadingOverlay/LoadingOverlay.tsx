import React from "react";
import classes from "./LoadingOverlay.module.css";


interface LoadingOverlayProps{
    isLoading: boolean;
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    message = "Processando...",
}) => {
    if(!isLoading) return null;

    return(
      <div className={classes.overlay}>
        <div className={classes.spinner}/>
        {message && <span className={classes.text}>{message}</span>}
      </div>  
    );
};

export default LoadingOverlay;