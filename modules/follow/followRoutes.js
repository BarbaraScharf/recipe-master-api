const express = require('express');
const router = express.Router();
const followController = require('./followController');
const asyncHandler = require('../../middlewares/asyncHandler');
const { isAuthenticated } = require('../../middlewares/auth');

router.post('/users/:userId/toggle-follow', isAuthenticated, asyncHandler(followController.toggleFollow));
router.get('/users/:userId/follow-status', isAuthenticated, asyncHandler(followController.getFollowStatus));
router.get('/users/:userId/followers', asyncHandler(followController.getFollowers));
router.get('/users/:userId/following', asyncHandler(followController.getFollowing));

module.exports = router;
