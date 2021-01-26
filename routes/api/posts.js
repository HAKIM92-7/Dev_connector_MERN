const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/user');
const config = require('config');
const request = require('request');
const Post = require('../../models/Post');

// @route  POST  api/post
// @desc   Create or update user post
// @access Private

router.post(
  '/',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      let post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server Error');
    }
  }
);
// @route  GET  api/post
// @desc   Get all posts
// @access Public

router.get('/', async (req, res) => {
  try {
    let posts = await Post.find().sort({ date: -1 });

    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'error server' });
  }
});

// @route  GET  api/post/:post_id
// @desc   Get  a post by id
// @access Public

router.get('/:post_id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'no post with this id' });
    }

    return res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'no post with this id' });
    }
    return res.status(500).json({ msg: 'error server' });
  }
});

// @route  DELETE  api/posts
// @desc   Delete a post
// @access Private

router.delete('/:post_id', auth, async (req, res) => {
  try {
    // remove profile
    let post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: 'no post with this id' });
    }

    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: 'you are not the owner of this post !!' });
    }

    await post.remove();

    return res.json({ msg: 'post removed' });
  } catch (err) {
    console.error(err.response);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'no post with this id' });
    }
    res.status(500).send('server errror');
  }
});

// @route  PUT api/posts/likes/:id
// @desc   like a post
// @access Private

router.put('/likes/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server Error');
  }
});
// @route  PUT api/posts/unllikes/:id
// @desc   unlike a post
// @access Private

router.put('/unlikes/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'post not liked yet' });
    }

    let indexOfUnlike = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(indexOfUnlike, 1);

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server Error');
  }
});

// @route  POST  api/post/comments/:id
// @desc   Comment a  post
// @access Private

router.post(
  '/comments/:id',
  [auth, [check('text', 'text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findById(req.user.id).select('-password');
      let post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server Error');
    }
  }
);

// @route  DELETE api/post/comments/:id/:comment_id
// @desc   Delete a comment
// @access Private

router.delete('/comments/:id/:comment_id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    let indexCommentToDelete = post.comments
      .map((comment) => comment.id)
      .indexOf(req.params.comment_id);

    if (
      post.user.toString() !== req.user.id &&
      post.comments[indexCommentToDelete].user.toString() !== req.user.id
    ) {
      return res
        .status(401)
        .json({ msg: 'you are not authorized to delete this comment' });
    }

    post.comments.splice(indexCommentToDelete, 1);

    await post.save();
    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server Error');
  }
});
module.exports = router;
