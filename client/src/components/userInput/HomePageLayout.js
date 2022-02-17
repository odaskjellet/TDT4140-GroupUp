import Card from '../../ui/Card';
import classes from './HomePageLayout.module.css';


function HomePageLayout() {

    return (
        <Card>
            <div className={classes.profile}>
                <h1>Hola!</h1>
            </div>
        </Card>
    )
}

export default HomePageLayout;
