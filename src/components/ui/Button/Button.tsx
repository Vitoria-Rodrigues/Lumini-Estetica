import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import classes from "./Button.module.css";

type ButtonProps = {
    title: string;
    padding?: string;
    width?: string;
    icon?: IconType;
    onClick?: () => void;
}

const Button = ({ title, padding, width, icon: Icon, onClick}: ButtonProps) => {
  const dynamicStyle = {
    "--btn-padding": padding,
    "--btn-width": width
  } as CSSProperties;

  return (
    <button className={classes.btn_principal} 
      style={dynamicStyle}
      onClick={onClick}>
      {Icon && <Icon className={classes.btn_icon} />}
      <span>{title}</span>
    </button>
  )
}

export default Button
