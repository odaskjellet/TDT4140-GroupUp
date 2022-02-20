import LoginForm from '../components/userInput/LoginForm';
import 'antd/dist/antd.css';
import {Avatar} from 'antd';


/**
 * A page for user login.
 * @return {JSX.Element}
 * @constructor
 */
function LoginPage() {
  return <section>
    <h1>Welcome to GroupUp</h1>
    <LoginForm/>
  </section>;
}

export default LoginPage;
