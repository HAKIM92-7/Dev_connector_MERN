import React from 'react';
import { Link } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import GoogleLogin from 'react-google-login';
const Landing = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const responseGoogle = (response) => {
    console.log(response);
  };
  return (
    <div>
      <section className='landing'>
        <div className='dark-overlay'>
          <div className='landing-inner'>
            <h1 className='x-large'>Developer Connector</h1>
            <p className='lead'>
              Create a developer profile/portfolio, share posts and get help
              from other developers
            </p>
            <div className='buttons'>
              {isAuthenticated ? (
                <Link to='dashboard' className='btn btn-primary'>
                  Dashboard
                </Link>
              ) : (
                <Link to='/register' className='btn btn-primary'>
                  Sign Up
                </Link>
              )}
              {isAuthenticated ? null : (
                <>
                  <Link to='/login' className='btn btn-light'>
                    Login
                  </Link>
                  <GoogleLogin
                    clientId='658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com'
                    buttonText='Login with Google'
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default connect()(Landing);
