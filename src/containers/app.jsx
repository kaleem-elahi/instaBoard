import React from 'react';
import { Route } from 'react-router-dom';
import Login from './components/login.jsx';
import Dashboard from './components/dashboard.jsx';
import Auth from '../hoc/auth';

const App = () => (
  <div>
    <main>
      <Route exact path="/" component={Login}/>
      <Route path="/login" component={Login} />
      <Route exact path="/dashboard" component={Auth(Dashboard)}/>

    </main>
  </div>
);
export default App;
