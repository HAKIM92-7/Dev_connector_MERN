import React, { useEffect, Fragment } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getCurrentProfile, deleteAcount } from '../../actions/profileActions';
import Spinner from '../layouts/Spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
const Dashboard = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const loading = useSelector((state) => state.profile.loading);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, []);

  return (
    <Fragment>
      {loading && !profile ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Dashboard</h1>
          <p>
            <i className='fas fa-user'></i>welcome {user && user.name}
          </p>
        </Fragment>
      )}
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Education education={profile.education} />
          <Experience experience={profile.experience} />

          <div className='my-2'>
            <button
              className='btn btn-danger'
              onClick={() => {
                dispatch(deleteAcount());
              }}
            >
              Delete your account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>you haven't yet a profile please send some infos</p>
          <Link to='/create-profile' className=' btn btn-primary my-1'>
            Create a profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

export default connect()(Dashboard);
