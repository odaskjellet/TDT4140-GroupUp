import Card from '../../ui/Card';
import classes from './HomePageLayout.module.css';
import {useContext} from 'react';
import {UserContext} from "../../contexts/User";

function HomePageLayout() {
    const [userState, userDispatch] = useContext(UserContext);
        if (userState.verified) {
            return <section>
            <div className={classes.row}>
                <div className={classes.profile}>
                    <h2>Column 1</h2>
                    <p>Hello {userState.username}! How do you do.</p> 
                </div>
                <div className={classes.information}>
                    <h2>Column 2</h2>
                    <h4>Informatin about happenings, matches etc?</h4>
                </div>
                <div className={classes.groups}>
                    <h2>Column 3</h2>
                    <h4>Information about my groups etc</h4>
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
