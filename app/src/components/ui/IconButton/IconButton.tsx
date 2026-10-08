import type { ButtonHTMLAttributes, ReactNode } from "react";
import classes from "./IconButton.module.css";


export type IconButtonVariant = "edit" | "delete" 
| "danger" | "success" | "payment" | "default";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    variant?: IconButtonVariant;
    title: string;
}

const IconButton = ({
    icon,
    variant = "default",
    title,
    type = "button",
    className = "",
    ...rest
}: IconButtonProps) => {
    const variantClass = classes[`variant_${variant}`] || classes.variant_default;

    return(
        <button
        type={type}
        title={title}
        aria-label={title}
        className={`${classes.icon_btn} ${variantClass} ${className}`}
        {...rest}
        >
          {icon}
        </button>
    );
};

export default IconButton;