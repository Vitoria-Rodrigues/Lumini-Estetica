import classes from './Card.module.css';

type CardProps = {
    title: string;
    valueCard: number;
    message: string;
}

const Card = ({title, valueCard, message}: CardProps) => {
  return (
    <div className={classes.card_container}>
        <p className={classes.title}>{title}</p>
        <h3 className={classes.value}>{valueCard}</h3>
        <p className={classes.message}>{message}</p>
    </div>
  )
}

export default Card

