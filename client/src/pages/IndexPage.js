import {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../contexts/User';

/**
 * The index page, which redirects to either /login or /home
 * @return {JSX.Element}
 * @constructor
 */
function IndexPage() {
  const [userState, userDispatch] = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userState.verified) {
      navigate('./home');
    } else {
      navigate('./login');
    }
  });

  return <section>
    Redirecting..
  </section>;
}

export default IndexPage;
