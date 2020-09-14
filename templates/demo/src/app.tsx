import React from 'react'
import './app.scss';
import { BrowserRouter, Route, Switch, HashRouter } from 'react-router-dom';
import HomePage from './page/home/index';
function App() {
    return (
        <div className="app">
            <HashRouter>
                <Switch>
                    <Route exact path="/home" component={HomePage} />
                </Switch>
            </HashRouter>
        </div>
    )
}

export default App;