import React from 'react';
import Card from '../../ui/Card';
import classes from './MyGroup.module.css';
import CreateGroupForm from '../userInput/CreateGroupForm';
import {useEffect, useState} from 'react';

export default function MyGroup() {
  const [groups, setGroups] = useState([]);

  useEffect(async () => {
    await fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const res = await fetch('/api/get-groups');
    setGroups(await res.json());
  };


  return (
    <div className={classes.test}>
      <div className={classes.group}>
        <Card>
          <h2>My groups</h2>
          {Array.from(groups).map((group) =>
            <Card>
              <h1>{group.name}</h1>
            </Card>,
          )}
        </Card>
      </div>
      <Card>
        <h2>Create a group</h2>
        <CreateGroupForm/>
      </Card>
    </div>
  );
}
