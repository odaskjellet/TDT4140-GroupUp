import {useContext} from 'react';
import {UserContext} from '../contexts/User';

/**
 * The home page: the page the user sees after logging in.
 * @return {JSX.Element}
 * @constructor
 */
function HomePage() {
  const [userState, userDispatch] = useContext(UserContext);

  if (userState.verified) {
    return <section>
      <h1>Hello world! {userState.username}</h1>
    </section>;
  } else {
    return <section>
      <h1>No user is signed in!</h1>
    </section>;
  }
}

export default HomePage;
