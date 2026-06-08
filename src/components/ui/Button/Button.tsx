import type { CSSProperties } from "react";
import classes from "./Button.module.css";

type ButtonProps = {
    title: string;
    padding?: string;
    width?: string;
    onClick?: () => void;
}

const Button = ({ title, padding, width, onClick}: ButtonProps) => {
  const dynamicStyle = {
    "--btn-padding": padding,
    "--btn-width": width
  } as CSSProperties;

  return (
    <button className={classes.btn_principal} 
      style={dynamicStyle}
      onClick={onClick}>
      {title}
    </button>
  )
}

export default Button
