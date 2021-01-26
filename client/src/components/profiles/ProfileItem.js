import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileByID } from '../../actions/profileActions';

const ProfileItem = ({ profile }) => {
  const dispatch = useDispatch();
  return (
    <div>
      <div class='profile bg-light'>
        <img class='round-img' src={profile.user.avatar} alt='' />
        <div>
          <h2>{profile.user.name}</h2>
          <p>{profile.status}</p>
          <p>{profile.location}</p>
          <Link
            to='/profile'
            class='btn btn-primary'
            onClick={() => dispatch(getProfileByID(profile.user._id))}
          >
            View Profile
          </Link>
        </div>

        <ul>
          {profile.skills.map((skill) => (
            <li class='text-primary'>
              <i class='fas fa-check'></i> {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileItem;
