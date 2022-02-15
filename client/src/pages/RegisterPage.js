import RegisterForm from '../components/userInput/RegisterForm';

/**
 * A page for user registration.
 * @return {JSX.Element}
 * @constructor
 */
function RegisterPage() {
  return <section>
    <h1>Register a new user</h1>
    <RegisterForm/>
  </section>;
}

export default RegisterPage;
