import React from 'react';
import './app.scss';
import { Route, Switch, HashRouter } from 'react-router-dom';
import HomePage from './page/home';

const App=()=>{
  return (
    <div className="app">
      <HashRouter basename='/elfbar/'>
        <Switch>
          <Route exact path={['/', '/home']} component={HomePage} />
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
