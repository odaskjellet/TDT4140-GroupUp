import React from 'react';
import classes from './MainNavigation.module.css';
import {Link} from 'react-router-dom';

export default function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to='/home'>GroupUp</Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to='/matches'>Find groups</Link>
          </li>
          <li>
            <Link to='/groups'>My groups</Link>
          </li>
          <li>
            <Link to='/profile'>My profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
