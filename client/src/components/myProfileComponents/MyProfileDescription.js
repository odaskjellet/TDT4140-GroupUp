
import { useState } from 'react';
import classes from './MyProfileDescription.module.css';

function ProfileDescription () {
    const[interest, setInterest] = useState([
        {interestName: skiing}
    ]);
return (
    <div style={{
        position: 'absolute', 
        left: '50%', 
        top: '50%',
        transform: 'translate(-50%, -50%)',
    }}>
        <div>
            <h1 style={{marginBottom: "0px"}}>Navn navnesen</h1>
            <h5 style={{color: "grey", marginTop: "0px"}}>@navnesen123</h5>
        </div>
        <div className={classes.userinfo}>
            <div className={classes.itembox}>Age: 34 </div>
            <div className={classes.itembox}>Email: Test@test.no </div>
        </div>
        <div className={classes.interests}>
            <h3>Interests</h3>
            {interest.map((interest, index) => (
                <div className={classes.interest-box}></div>
            ))}
        </div>
    </div>
)
}

export default ProfileDescription;