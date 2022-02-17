import HomePageLayout from "../components/userInput/HomePageLayout";
import {useContext} from 'react';
import {UserContext} from '../contexts/User';

/**
 * The home page: the page the user sees after logging in.
 * @return {JSX.Element}
 * @constructor
 */
function HomePage() {
  return <section>
    <HomePageLayout/>
  </section>;
}

export default HomePage;
