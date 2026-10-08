import type { CSSProperties, ButtonHTMLAttributes } from "react";
import type { IconType } from "react-icons";
import classes from "./Button.module.css";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    padding?: string;
    width?: string;
    icon?: IconType;
}

const Button = ({ 
  title, 
  padding, 
  width, 
  icon: Icon, 
  type = "button",
  ...rest
}: ButtonProps) => {
  const dynamicStyle = {
    "--btn-padding": padding,
    "--btn-width": width
  } as CSSProperties;

  return (
    <button className={classes.btn_principal} 
      style={dynamicStyle}
      type={type}
      {...rest}>

      {Icon && <Icon className={classes.btn_icon} />}
      <span>{title}</span>
    </button>
  )
}

export default Button
