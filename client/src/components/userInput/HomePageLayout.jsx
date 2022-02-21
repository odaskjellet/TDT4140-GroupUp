import React from 'react';
import classes from './HomePageLayout.module.css';
import {useContext} from 'react';
import {UserContext} from '../../contexts/User';

function HomePageLayout() {
  const [userState, _] = useContext(UserContext);
  if (userState.verified) {
    return <section>
      <div className={classes.boxes}>
        <div className={classes.profile}>
          <h2>Welcome {userState.username}! How do you do?</h2>
        </div>
        <div className={classes.information}>
          <h2>Information of the nation</h2>
          <p>Informatin about happenings, matches etc?</p>
        </div>
        <div className={classes.groups}>
          <h2>Groups and hoops</h2>
          <p>Information about my groups etc</p>
        </div>
      </div>
    </section>;
  } else {
    return <section>
      <h1>Not signed in!</h1>
    </section>;
  }
}

export default HomePageLayout;
