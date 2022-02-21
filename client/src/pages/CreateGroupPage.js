import CreateGroupForm from '../components/userInput/CreateGroupForm';
import classes from './LoginPage.module.css';

export default function GroupPage() {
  return <div className={classes.wrapper}>
    <br></br>
    <CreateGroupForm/>
  </div>;
}
