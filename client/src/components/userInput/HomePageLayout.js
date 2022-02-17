import Card from '../../ui/Card';
import classes from './HomePageLayout.module.css';

function HomePageLayout() {

    return (
        <Card>
            <div className={classes.welcome}>
                <p>Hello Firstname Lastname! How do you do.</p>
            </div>
            <div className={classes.row}>
                <div className={classes.profile}>
                    <h2>Column 1</h2>
                    <h4>Information about profile etc!</h4>
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
        </Card>
    )
}

export default HomePageLayout;
