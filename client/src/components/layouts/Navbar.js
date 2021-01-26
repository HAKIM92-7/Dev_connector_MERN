import React from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/authActions';
import '../../App.css';
const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div>
      <nav className='navbar bg-dark'>
        <h1>
          <Link to='/'>
            <i className='fas fa-code'></i> DevConnector
          </Link>
        </h1>
        <ul>
          <li>
            <Link to='/profiles'>Developpers</Link>
          </li>
          <li>
            {isAuthenticated ? (
              <Link to='/dashboard'>Dashboard</Link>
            ) : (
              <Link to='/register'>Register</Link>
            )}
          </li>
          <li>
            {isAuthenticated ? (
              <Link to='/' onClick={() => dispatch(logout())}>
                Logout
              </Link>
            ) : (
              <Link to='/login'>Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default connect()(Navbar);
