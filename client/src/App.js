import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Route, Switch } from 'react-router-dom';
import Alert from './components/layouts/Alert';
import { loadUser } from './actions/authActions';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import FullProfile from './components/profiles/FullProfile';

import './App.css';

const App = () => {
  useEffect(() => {
    dispatch(loadUser());
  });
  const dispatch = useDispatch();
  return (
    <Fragment>
      <Navbar />
      <Route exact={true} path='/' component={Landing} />
      <section className='container'>
        <Alert />
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute
            exact
            path='/create-profile'
            component={CreateProfile}
          />
          <PrivateRoute exact path='/edit-profile' component={EditProfile} />
          <PrivateRoute
            exact
            path='/add-experience'
            component={AddExperience}
          />
          <PrivateRoute exact path='/add-education' component={AddEducation} />
          <Route exact path='/profiles' component={Profiles} />
          <Route exact path='/profile' component={FullProfile} />
        </Switch>
      </section>
    </Fragment>
  );
};

export default App;
