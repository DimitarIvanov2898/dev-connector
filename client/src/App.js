import React, {Fragment, useEffect} from 'react';
import Navbar from './components/layout/Navbar'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/profile-form/CreateProfile'
import PrivateRoute from './components/routing/PrivateRoute'
import './App.css';
//store related stuff
import {Provider} from 'react-redux'
import store from './store'
import setAuthToken from './utils/setAuthToken';
import {loadUser} from './actions/auth'


if(localStorage.token){
  setAuthToken(localStorage.token)
}
const App = () => {
  //adding empty set of brackets to run just once
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  
  return (
  <Provider store={store}>
    <Router>
    <Fragment>
    <Navbar />
    <Route exact path="/" component={Landing}/>
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={CreateProfile} />
      </Switch>
    </section>
    </Fragment>
    </Router>
  </Provider>
  
  
)}
  

export default App;
