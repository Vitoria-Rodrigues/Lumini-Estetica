import type { CSSProperties } from "react";
import classes from "./Button.module.css";

type ButtonProps = {
    title: string;
    padding?: string;
    onClick?: () => void;
}

const Button = ({ title, padding, onClick}: ButtonProps) => {
  const dynamicStyle = {
    "--btn-padding": padding
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
