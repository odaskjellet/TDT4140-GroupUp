import classes from './Card.module.css';

/**
 * Creates a custom "card" div that you can use to wrap elements in.
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function Card(props) {
  return <div className={classes.card}> {props.children}

  </div>;
}

export default Card;
