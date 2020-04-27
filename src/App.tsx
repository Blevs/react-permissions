import React from 'react';
import { Switch, Route } from 'react-router';
import Login from './components/Login';
import Manager from './components/Manager';
import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.root}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route>
          <Manager />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
