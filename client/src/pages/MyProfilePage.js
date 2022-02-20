import MyProfileDescription from '../components/myProfileComponents/MyProfileDescription';
import MyProfilePicture from '../components/myProfileComponents/MyProfilePicture';
import Settings from '../components/myProfileComponents/Settings';


/**
 * A page for userprofile information.
 */
function MyProfilePage() {
  return <section>
    <Settings/>
    <MyProfilePicture />
    <MyProfileDescription />
  </section>;
}

export default MyProfilePage;

// TODO: Må inneholde en settingsknapp, slik at man får endret brukerinfo :)
