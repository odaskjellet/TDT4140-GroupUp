import CreateGroupForm from '../components/userInput/CreateGroupForm';
import classes from './LoginPage.module.css';

export default function GroupPage() {
  return <div className={classes.wrapper}>
    <h1>Create a new group</h1>
    <CreateGroupForm/>
  </div>;
}
