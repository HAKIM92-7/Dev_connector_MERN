import React, { useEffect, Fragment } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getAllProfiles } from '../../actions/profileActions';

import ProfileItem from './ProfileItem';

const Profiles = () => {
  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.profile.profiles);
  useEffect(() => {
    dispatch(getAllProfiles());
  }, []);

  return (
    <Fragment>
      <h1 class='large text-primary'>Developers</h1>
      <p class='lead'>
        <i class='fab fa-connectdevelop'></i> Browse and connect with developers
      </p>
      <div class='profiles'>
        {profiles.map((profile) => (
          <ProfileItem profile={profile} />
        ))}
      </div>
    </Fragment>
  );
};

export default connect()(Profiles);
