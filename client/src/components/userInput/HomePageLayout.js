import Card from '../../ui/Card';
import classes from './HomePageLayout.module.css';
import {useContext} from 'react';
import {UserContext} from "../../contexts/User";

function HomePageLayout() {
    const [userState, userDispatch] = useContext(UserContext);
        if (userState.verified) {
            return <section>
            <div className={classes.boxes}>
                <div className={classes.profile}>
                    <h2>Column 1</h2>
                    <p>Hello {userState.username}! How do you do.</p> 
                </div>
                <div className={classes.information}>
                    <h2>Column 2</h2>
                    <p>Informatin about happenings, matches etc?</p>
                </div>
                <div className={classes.groups}>
                    <h2>Column 3</h2>
                    <p>Information about my groups etc</p>
                </div>
            </div>
            </section>
        }
        else {
            return <section>
                <h1>Not signed in!</h1>
            </section>
        }
}

export default HomePageLayout;
