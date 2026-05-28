import classes from "./Button.module.css";

type ButtonProps = {
    title: string,
}

const Button = ({title}: ButtonProps) => {
  return (
    <div>
      <button className={`${classes.btn_principal} ${classes.btn_primary_size}`}>{title}</button>
    </div>
  )
}

export default Button
