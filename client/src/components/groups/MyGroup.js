import Card from "../../ui/Card";
import classes from './MyGroup.module.css';
import CreateGroupForm from "../userInput/CreateGroupForm";
import {useEffect} from "react";

export default function MyGroup() {


    useEffect(() => {
        const getData = async () => {
            const dataFromServer = await fetchGroups()

        }
        getData()
    }, []);

    const fetchGroups = async () => {
        const res = await fetch('api/get_group')
        return await res.json();
    }


    return (
        <div className={classes.test}>


            <div className={classes.group}>
                <Card>
                    <h2>My groups</h2>


                </Card>

            </div>
            <Card>
                <h2>Create a group</h2>

                <CreateGroupForm/>
            </Card>

        </div>
    )
}