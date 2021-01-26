const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/user');
const config = require('config');
const request = require('request');
const Post = require('../../models/Post');

// @route  GET  api/profile/me
// @desc   current user profile
// @access Private

router.get('/me', auth, async function (req, res) {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: "you haven't a profile yet" });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

// @route  POST  api/profile
// @desc   Create or update user profile
// @access Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (location) profileFields.location = location;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    //social object

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      profile = new Profile(profileFields);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server Error');
    }
  }
);

// @route  GET  api/profile
// @desc   Get all profiles
// @access Public

router.get('/', async (req, res) => {
  try {
    let allProfiles = await Profile.find().populate('user', [
      '_id',
      'name',
      'avatar',
    ]);

    return res.json(allProfiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('error server');
  }
});

// @route  GET  api/profile/user/:user_id
// @desc   Get a user profile
// @access Public

router.get('/user/:user_id', async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile)
      return res.status(400).json({ msg: "this user don't have profile ! " });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: "this user don't have profile ! " });
    }
    return res.status(500).send('error server');
  }
});

// @route  DELETE  api/profile
// @desc   Delete a profile and a user
// @access Private

router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    // remove profile
    await Profile.findOneAndDelete({ user: req.user.id });

    // remove user
    await User.findByIdAndDelete({ _id: req.user.id });
    return res.json({ msg: 'user & profile removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server errror');
  }
});

// @route  PUT  api/profile/experience
// @desc   Add a profile experience
// @access Private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title field is required').not().isEmpty(),
      check('company', 'company field is required').not().isEmpty(),
      check('from', 'from field is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server errror');
    }
  }
);

// @route  DELETE  api/profile/experience
// @desc   Delete an experience
// @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    let removeIndex = profile.experience
      .map((el) => el.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server errror');
  }
});

// @route  PUT  api/profile/education
// @desc   Add a profile education
// @access Private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Fieldofstudy is required').not().isEmpty(),
      check('from', 'From is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('menich 5adem serveur m3aaak');
    }
  }
);

// @route  DELETE  api/profile/education/:educ_id
// @desc   Delete an education
// @access Private

router.delete('/education/:educ_id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    let removeIndex = profile.education
      .map((el) => el.id)
      .indexOf(req.params.educ_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server errror');
  }
});

// @route  GET  api/profile/github/:username
// @desc   Get user repos from github
// @access Public

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}
&client-secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No github profile found' });
      }
      return res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server errror');
  }
});

module.exports = router;
